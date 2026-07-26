# Complaint Registration & Tracking System

A web-based Complaint Registration & Tracking System that enables users to register complaints, monitor their status in real time, and allows administrators to efficiently manage and resolve complaints through a centralized dashboard.

---

## 📌 Features

### 👤 User Features
- Google Authentication using Firebase
- Register new complaints
- View complaint history
- Track complaint status
- Responsive and user-friendly interface

### 🛠 Admin Features
- Secure admin dashboard
- View all complaints
- Search and filter complaints
- Update complaint status
- Manage complaint records

---

## 🚀 Technology Stack

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- Microsoft SQL Server (SSMS)

### Authentication
- Firebase Google Authentication

---

## 📂 Project Structure

## 📂 Project Structure

```text
complaint-tracker-portal/
├── .env                         
├── .gitignore            
├── package.json         
├── package-lock.json    
├── README.md           
├── server.js             
└── public/             
    ├── index.html       
    └── styles.css                
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Anuragjha06/ComplaintPortal.git
```

### 2. Navigate to the project

```bash
cd Complaint-Registration-System
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file and add:

```env
DB_SERVER=YOUR_SERVER_NAME
DB_DATABASE=ComplaintDB
DB_USER=YOUR_USERNAME
DB_PASSWORD=YOUR_PASSWORD
GOOGLE_CLIENT_ID
```

---

## ▶️ Run the Application

```bash
node server.js
```

Visit:

```
http://localhost:5000
```

---

## 🗄 Database Schema

### Users

| Column | Type |
|---------|------|
| UserID | INT |
| Name | VARCHAR |
| Email | VARCHAR |
| GoogleID | VARCHAR |

### Complaints

| Column | Type |
|---------|------|
| ComplaintID | INT |
| UserID | INT |
| Category | VARCHAR |
| Description | TEXT |
| Status | VARCHAR |
| Date | DATETIME |
| AdminReply | VARHAR |

### Admin

| Column | Type |
|---------|------|
| AdminID | INT |
| Name | VARCHAR |
| Email | VARCHAR |
| Role | VARCHAR |

---

## 🔄 System Workflow

1. User logs in using Google Authentication.
2. User registers a complaint.
3. Complaint is stored in SQL Server.
4. Admin reviews the complaint.
5. Admin updates the complaint status.
6. User tracks the updated status until resolution.

---

## 🔐 Security

- Firebase Google Authentication
- Role-based access (User/Admin)
- Secure database storage
- HTTPS communication
- Authentication and authorization

---

## 📈 Future Enhancements

- Email notifications
- Complaint priority levels
- Complaint attachments
- Analytics dashboard
- Mobile responsive improvements
- SMS notifications
- Export reports (PDF/Excel)

---

## 👨‍💻 Contributors

- **Anurag Jha**
- **Ankush Jha**
- **Alok Jha**

---

## 📄 License

This project is developed for educational purposes.

---

## ⭐ Acknowledgements

- Firebase Authentication
- Node.js
- Express.js
- Microsoft SQL Server
- HTML, CSS & JavaScript
