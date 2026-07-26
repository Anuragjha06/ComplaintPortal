IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Complaints' AND COLUMN_NAME = 'AdminReply'
)
BEGIN
    ALTER TABLE Complaints ADD AdminReply NVARCHAR(MAX) NULL;
END
GO

CREATE OR ALTER VIEW vw_ComplaintDetails AS
SELECT 
    c.ComplaintID,
    c.UserID,
    u.Name AS UserName,
    u.Email AS UserEmail,
    c.Category,
    c.Description,
    c.Status,
    c.AdminReply,
    c.CreatedDate,
    c.UpdatedDate
FROM Complaints c
INNER JOIN Users u ON c.UserID = u.UserID;
GO
