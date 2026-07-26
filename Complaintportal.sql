CREATE DATABASE ComplaintSystemDB;
GO

USE ComplaintSystemDB;
GO

CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    GoogleID VARCHAR(255) NOT NULL UNIQUE,
    Name NVARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    CreatedAt DATETIME DEFAULT GETDATE()
);
CREATE TABLE Admin (
    AdminID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    Role NVARCHAR(50) DEFAULT 'SuperAdmin'
);

CREATE TABLE Complaints (
    ComplaintID INT IDENTITY(1001,1) PRIMARY KEY,
    UserID INT NOT NULL,
    Category NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    Status NVARCHAR(50) DEFAULT 'Submitted' CHECK (Status IN ('Submitted', 'In Progress', 'Resolved')),
    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);
GO
    
INSERT INTO Admin (Name, Email, Role) 
VALUES ('System Admin', 'admin@yourdomain.com', 'SuperAdmin');
GO
    
CREATE PROCEDURE sp_SyncUser
    @GoogleID VARCHAR(255),
    @Name NVARCHAR(100),
    @Email VARCHAR(150)
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Users WHERE GoogleID = @GoogleID)
    BEGIN
        INSERT INTO Users (GoogleID, Name, Email)
        VALUES (@GoogleID, @Name, @Email);
    END
    SELECT UserID, Name, Email FROM Users WHERE GoogleID = @GoogleID;
END;
GO

CREATE VIEW vw_ComplaintDetails AS
SELECT 
    c.ComplaintID,
    u.Name AS UserName,
    u.Email AS UserEmail,
    c.Category,
    c.Description,
    c.Status,
    c.CreatedDate,
    c.UpdatedDate
FROM Complaints c
INNER JOIN Users u ON c.UserID = u.UserID;
GO
