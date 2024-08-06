-- This sql file is for to standarlize database across all developer
-- 1. Create a local developement sql server
-- 2. run file
-- 3. run this sql for restart the database





Drop database development;
create database development;
use development;
-- Create Currency Table
CREATE TABLE Currency (
    CurrencyID INT AUTO_INCREMENT PRIMARY KEY,
    CurrencyCode VARCHAR(10)
);

-- Create SupportRegion Table
CREATE TABLE SupportRegion (
    SupportRegionID INT AUTO_INCREMENT PRIMARY KEY,
    Region VARCHAR(100)
);

-- Create UserRole Table
CREATE TABLE UserRole (
    UserRoleID INT AUTO_INCREMENT PRIMARY KEY,
    UserRole VARCHAR(50)
);

-- Create Agent Table
CREATE TABLE Agent (
    AgentID INT AUTO_INCREMENT PRIMARY KEY,
    AWSID VARCHAR(50),
    UserRoleID INT,
    FOREIGN KEY (UserRoleID) REFERENCES UserRole(UserRoleID)
);

-- Create Customer Table
CREATE TABLE Customer (
    CustomerID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100),
    Email VARCHAR(100),
    ManyChatID JSON,
    ExpireDate DATE,
    UserCountry VARCHAR(100),
    ContactLink VARCHAR(15),
    AgentID INT,
    CardID INT,
    FOREIGN KEY (AgentID) REFERENCES Agent(AgentID)
);

-- Create Wallet Table
CREATE TABLE Wallet (
    WalletID INT AUTO_INCREMENT PRIMARY KEY,
    CurrencyID INT,
    WalletName VARCHAR(100),
    FOREIGN KEY (CurrencyID) REFERENCES Currency(CurrencyID)
);

-- Create Note Table
CREATE TABLE Note (
    NoteID INT AUTO_INCREMENT PRIMARY KEY,
    Note TEXT,
    Date DATE,
    AgentID INT,
    FOREIGN KEY (AgentID) REFERENCES Agent(AgentID)
);

-- Create Transactions Table
CREATE TABLE Transactions (
    TransactionID INT AUTO_INCREMENT PRIMARY KEY,
    CustomerID INT,
    SupportRegionID INT,
    WalletID INT,
    Amount FLOAT,
    Screenshot VARCHAR(2048),
    AgentID INT,
    PaymentCheck BOOLEAN,
    PaymentCheckTime DATE,
    NoteID INT,
    TransactionDate DATE,
    PaymentDenied BOOLEAN,
    Month INT,
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    FOREIGN KEY (SupportRegionID) REFERENCES SupportRegion(SupportRegionID),
    FOREIGN KEY (WalletID) REFERENCES Wallet(WalletID),
    FOREIGN KEY (AgentID) REFERENCES Agent(AgentID),
    FOREIGN KEY (NoteID) REFERENCES Note(NoteID)
);


-- Insert data into Currency Table
INSERT INTO Currency (CurrencyID, CurrencyCode)
VALUES 
(1, 'USD'),
(2, 'EUR'),
(3, 'JPY');

-- Insert data into SupportRegion Table
INSERT INTO SupportRegion (SupportRegionID, Region)
VALUES 
(1, 'North America'),
(2, 'Europe'),
(3, 'Asia');

-- Insert data into UserRole Table
INSERT INTO UserRole (UserRoleID, UserRole)
VALUES 
(1, 'Support Agent'),
(2, 'Administrator');

-- Insert data into Agent Table
INSERT INTO Agent (AgentID, AWSID, UserRoleID)
VALUES 
(1, 'AWS-1234', 1),
(2, 'AWS-5678', 2);

-- Insert data into Customer Table
INSERT INTO Customer (CustomerID, Name, Email, ManyChatID, ExpireDate, UserCountry, ContactLink, AgentID, CardID)
VALUES 
(1, 'John Doe', 'john.doe@example.com', JSON_ARRAY('Chat1', 'Chat2'), '2025-12-31', 'USA', '1234567890', 1, 1001),
(2, 'Jane Smith', 'jane.smith@example.com', JSON_ARRAY('Chat3', 'Chat4'), '2025-12-31', 'Germany', '0987654321', 2, 1002);

-- Insert data into Wallet Table
INSERT INTO Wallet (WalletID, CurrencyID, WalletName)
VALUES 
(1, 1, 'Personal Wallet'),
(2, 2, 'Business Wallet'),
(3, 3, 'Savings Wallet');

-- Insert data into Note Table
INSERT INTO Note (NoteID, Note, Date, AgentID)
VALUES 
(1, 'Transaction processed successfully.', '2024-07-01', 1),
(2, 'Customer requested refund.', '2024-07-02', 2);

-- Insert data into Transactions Table
INSERT INTO Transactions (TransactionID, CustomerID, SupportRegionID, WalletID, Amount, Screenshot, AgentID, PaymentCheck, PaymentCheckTime, NoteID, TransactionDate, PaymentDenied, Month)
VALUES 
(1, 1, 1, 1, 100.00, "https://your-bucket-name.s3.amazonaws.com/path/to/image.png", 1, TRUE, '2024-07-01', 1, '2024-07-01', FALSE, 7),
(2, 2, 2, 2, 200.00, "https://your-bucket-name.s3.amazonaws.com/path/to/image.png", 2, FALSE, '2024-07-02', 2, '2024-07-02', TRUE, 7);
