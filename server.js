require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');

const app = express();

app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:5000'],
    credentials: true
}));

app.use(express.json());

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const dbConfig = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER || 'ANURAG',
    database: process.env.DB_NAME,
    port: 1433,
    options: { encrypt: false, trustServerCertificate: true }
};

sql.connect(dbConfig).then(pool => {
    if (pool.connected) console.log('Connected to MSSQL Database!');
}).catch(err => console.error('Database connection failed: ', err));

// ------------------- GOOGLE AUTH -------------------
app.post('/api/auth/google', async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,
        });
        
        const payload = ticket.getPayload();
        const googleId = payload['sub'];
        const email = payload['email'];
        const name = payload['name'];

        const pool = await sql.connect(dbConfig);
        const userResult = await pool.request()
            .input('GoogleID', sql.VarChar, googleId)
            .input('Name', sql.NVarChar, name)
            .input('Email', sql.VarChar, email)
            .execute('sp_SyncUser');

        const adminCheck = await pool.request()
            .input('Email', sql.VarChar, email)
            .query('SELECT AdminID FROM Admin WHERE Email = @Email');

        const isAdmin = adminCheck.recordset.length > 0;
        const user = userResult.recordset[0];

        res.json({ success: true, user: { ...user, isAdmin } });
    } catch (err) {
        console.error("Auth Error:", err);
        res.status(401).json({ success: false, message: 'Invalid Token: ' + err.message });
    }
});

// ------------------- USER ENDPOINTS -------------------

// Submit New Complaint
app.post('/api/complaints', async (req, res) => {
    const { userId, category, description } = req.body;
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('UserID', sql.Int, userId)
            .input('Category', sql.NVarChar, category)
            .input('Description', sql.NVarChar, description)
            .query('INSERT INTO Complaints (UserID, Category, Description) VALUES (@UserID, @Category, @Description)');

        res.json({ success: true, message: 'Complaint registered successfully!' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Fetch Complaints for logged-in user
app.get('/api/complaints/user/:userId', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('UserID', sql.Int, req.params.userId)
            .query('SELECT ComplaintID, Category, Description, Status, AdminReply, CreatedDate FROM Complaints WHERE UserID = @UserID ORDER BY CreatedDate DESC');

        res.json({ success: true, data: result.recordset });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ------------------- ADMIN ENDPOINTS -------------------

// Get All Complaints for Admin
app.get('/api/admin/complaints', async (req, res) => {
    const { status, search } = req.query;
    try {
        const pool = await sql.connect(dbConfig);
        let query = 'SELECT * FROM vw_ComplaintDetails WHERE 1=1';
        const request = pool.request();

        if (status && status !== 'All') {
            query += ' AND Status = @Status';
            request.input('Status', sql.NVarChar, status);
        }
        if (search) {
            query += ' AND (Category LIKE @Search OR UserName LIKE @Search OR ComplaintID LIKE @Search)';
            request.input('Search', sql.NVarChar, `%${search}%`);
        }

        query += ' ORDER BY CreatedDate DESC';
        const result = await request.query(query);
        res.json({ success: true, data: result.recordset });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Admin Resolve / Update Status & Reply
app.put('/api/admin/complaints/:id', async (req, res) => {
    const { status, adminReply } = req.body;
    const { id } = req.params;
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Status', sql.NVarChar, status)
            .input('AdminReply', sql.NVarChar, adminReply || null)
            .input('ComplaintID', sql.Int, id)
            .query('UPDATE Complaints SET Status = @Status, AdminReply = @AdminReply, UpdatedDate = GETDATE() WHERE ComplaintID = @ComplaintID');

        res.json({ success: true, message: 'Complaint updated successfully!' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Express route to expose Client ID dynamically
app.get('/api/config', (req, res) => {
    res.json({
        googleClientId: process.env.GOOGLE_CLIENT_ID
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));