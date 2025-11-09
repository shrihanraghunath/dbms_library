-- ======================================================================
-- PART 1: DATABASE & BASE TABLES
-- ======================================================================

-- Delete old version if exists
DROP DATABASE IF EXISTS library_db;

-- Create fresh database
CREATE DATABASE library_db;

-- Switch to this database
USE library_db;

-- 1️⃣ ADDRESS TABLE
CREATE TABLE Address (
    Address_ID INT AUTO_INCREMENT PRIMARY KEY,
    Street VARCHAR(100),
    City VARCHAR(50),
    Pincode VARCHAR(10)
);

-- 2️⃣ MEMBER TABLE
CREATE TABLE Member (
    Member_ID INT AUTO_INCREMENT PRIMARY KEY,
    First_Name VARCHAR(50) NOT NULL,
    Second_Name VARCHAR(50),
    Last_Name VARCHAR(50),
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone VARCHAR(15) NOT NULL,
    Membership_Type ENUM('Regular','Premium') NOT NULL,
    Date_of_Join DATE NOT NULL,
    Address_ID INT,
    FOREIGN KEY (Address_ID) REFERENCES Address(Address_ID)
        ON DELETE SET NULL ON UPDATE CASCADE
);

-- 3️⃣ PUBLISHER TABLE
CREATE TABLE Publisher (
    Publisher_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Address_ID INT,
    Contact_No VARCHAR(20),
    FOREIGN KEY (Address_ID) REFERENCES Address(Address_ID)
        ON DELETE SET NULL ON UPDATE CASCADE
);

-- 4️⃣ AUTHOR TABLE
CREATE TABLE Author (
    Author_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Nationality VARCHAR(50)
);

-- 5️⃣ STAFF TABLE
CREATE TABLE Staff (
    Staff_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Role ENUM('Librarian','Admin','Assistant','clerk') NOT NULL,
    Salary DECIMAL(10,2),
    Contact VARCHAR(15)
);
-- SHOW TABLES;
-- ======================================================================
-- PART 2: BOOK, TRANSACTION & RELATIONSHIP TABLES
-- ======================================================================

-- 6️⃣ BOOK TABLE
CREATE TABLE Book (
    Book_ID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(150) NOT NULL,
    ISBN VARCHAR(20) UNIQUE NOT NULL,
    Edition VARCHAR(20),
    Genre VARCHAR(50),
    Total_Copies INT DEFAULT 1 CHECK (Total_Copies > 0),
    Available_Copies INT DEFAULT 1 CHECK (Available_Copies >= 0),
    Publisher_ID INT NOT NULL,
    FOREIGN KEY (Publisher_ID) REFERENCES Publisher(Publisher_ID)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- 7️⃣ BOOK_AUTHOR (M:N RELATIONSHIP)
CREATE TABLE Book_Author (
    Book_ID INT NOT NULL,
    Author_ID INT NOT NULL,
    PRIMARY KEY (Book_ID, Author_ID),
    FOREIGN KEY (Book_ID) REFERENCES Book(Book_ID)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Author_ID) REFERENCES Author(Author_ID)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- 8️⃣ TRANSACTION TABLE
CREATE TABLE `Transaction` (
    Transaction_ID INT AUTO_INCREMENT PRIMARY KEY,
    Issue_Date DATE NOT NULL,
    Due_Date DATE,
    Return_Date DATE,
    Fine DECIMAL(8,2) DEFAULT 0.00
);

-- 9️⃣ BORROW TABLE  (Ternary relationship: Member–Book–Staff)
CREATE TABLE Borrow (
    Borrow_ID INT AUTO_INCREMENT PRIMARY KEY,
    Member_ID INT NOT NULL,
    Book_ID INT NOT NULL,
    Transaction_ID INT NOT NULL,
    Staff_ID INT NULL,
    Remarks VARCHAR(255),
    FOREIGN KEY (Member_ID) REFERENCES Member(Member_ID)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Book_ID) REFERENCES Book(Book_ID)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Transaction_ID) REFERENCES `Transaction`(Transaction_ID)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Staff_ID) REFERENCES Staff(Staff_ID)
        ON DELETE SET NULL ON UPDATE CASCADE,
    UNIQUE (Member_ID, Book_ID, Transaction_ID)
);

-- 🔟 RESERVATION TABLE (Ternary relationship: Member–Book)
CREATE TABLE Reservation (
    Reservation_ID INT AUTO_INCREMENT PRIMARY KEY,
    Member_ID INT NOT NULL,
    Book_ID INT NOT NULL,
    Reservation_Date DATE DEFAULT (CURDATE()),
    Status ENUM('Active','Fulfilled','Cancelled','pending') DEFAULT 'Active',
    FOREIGN KEY (Member_ID) REFERENCES Member(Member_ID)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Book_ID) REFERENCES Book(Book_ID)
        ON DELETE CASCADE ON UPDATE CASCADE
);
-- SHOW TABLES;
-- DESCRIBE Reservation;
-- ======================================================================
-- PART 3: INDEXES & VIEWS
-- ======================================================================

-- 📈 INDEXES — Improve performance for frequent searches
CREATE INDEX idx_book_genre ON Book(Genre);
CREATE INDEX idx_member_email ON Member(Email);
CREATE INDEX idx_transaction_issue_date ON `Transaction`(Issue_Date);

-- 🪟 VIEW 1: Members who joined in the last 1 year
CREATE VIEW Recent_Members AS
SELECT 
    Member_ID,
    CONCAT(First_Name, ' ', COALESCE(Second_Name,''), ' ', Last_Name) AS Full_Name,
    Email,
    Membership_Type,
    Date_of_Join
FROM Member
WHERE Date_of_Join >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR);

-- 🪟 VIEW 2: Book availability summary
CREATE VIEW Book_Summary AS
SELECT 
    Book_ID, 
    Title, 
    ISBN, 
    Genre, 
    Total_Copies, 
    Available_Copies
FROM Book;

-- 🪟 VIEW 3: Borrowed Books Details (optional but great for viva)
CREATE VIEW Borrowed_Books_Detail AS
SELECT 
    br.Borrow_ID,
    CONCAT(m.First_Name, ' ', m.Last_Name) AS Member_Name,
    b.Title AS Book_Title,
    t.Issue_Date,
    t.Due_Date,
    t.Return_Date,
    t.Fine,
    s.Name AS Processed_By
FROM Borrow br
JOIN Member m ON br.Member_ID = m.Member_ID
JOIN Book b ON br.Book_ID = b.Book_ID
JOIN `Transaction` t ON br.Transaction_ID = t.Transaction_ID
LEFT JOIN Staff s ON br.Staff_ID = s.Staff_ID;

 SHOW FULL TABLES WHERE Table_type = 'VIEW';
-- SELECT * FROM Recent_Members;
-- SELECT * FROM Book_Summary;
-- SELECT * FROM Borrowed_Books_Detail;
-- ======================================================================
-- PART 4: INSERTING SAMPLE DATA (DML)
-- ======================================================================

-- 📍 ADDRESS DATA
-- 🏠 ADDRESS DATA
INSERT INTO Address (Street, City, Pincode) VALUES
('12 MG Road', 'Bangalore', '560001'),
('221B Baker Street', 'London', 'NW16XE'),
('No.5, MG Colony', 'Pune', '411001'),
('45 Park Street', 'Kolkata', '700016'),
('16 Fifth Avenue', 'New York', '10011'),
('10 Downing Street', 'London', 'SW1A2AA');

-- 👤 PUBLISHER DATA
INSERT INTO Publisher (Name, Address_ID, Contact_No) VALUES
('Penguin Random House', 1, '080-11112222'),
('HarperCollins', 2, '020-33334444'),
('Oxford University Press', 4, '033-55556666'),
('Bloomsbury Publishing', 6, '020-77778888');

-- ✍️ AUTHOR DATA
INSERT INTO Author (Name, Nationality) VALUES
('J.K. Rowling', 'British'),
('George Orwell', 'British'),
('R.K. Narayan', 'Indian'),
('Agatha Christie', 'British'),
('Chetan Bhagat', 'Indian'),
('Mark Twain', 'American');

-- 🧑‍💼 STAFF DATA
INSERT INTO Staff (Name, Role, Salary, Contact) VALUES
('Priya Rao', 'Librarian', 50000.00, '9876543210'),
('Arun Kumar', 'Assistant', 30000.00, '9123456789'),
('Meena Das', 'Admin', 55000.00, '9900112233'),
('Suresh Iyer', 'Clerk', 25000.00, '9811122233'),
('Rita Fernandez', 'Librarian', 48000.00, '9765432199');

-- 🧑‍🤝‍🧑 MEMBER DATA
INSERT INTO Member (First_Name, Second_Name, Last_Name, Email, Phone, Membership_Type, Date_of_Join, Address_ID) VALUES
('John', NULL, 'Doe', 'john.doe@example.com', '9991112222', 'Regular', '2024-08-15', 1),
('Anita', 'M', 'Kumar', 'anita.k@example.com', '8884445555', 'Premium', '2025-01-10', 3),
('Ramesh', NULL, 'Patel', 'ramesh.p@example.com', '7773332222', 'Regular', '2023-06-05', 1),
('Sneha', NULL, 'Roy', 'sneha.roy@example.com', '9996665554', 'Regular', '2024-02-21', 4),
('David', NULL, 'Miller', 'david.miller@example.com', '7778889990', 'Premium', '2023-09-11', 5),
('Amit', 'S', 'Verma', 'amit.verma@example.com', '9988776655', 'Regular', '2024-12-02', 1);

-- 📚 BOOK DATA
INSERT INTO Book (Title, ISBN, Edition, Genre, Total_Copies, Available_Copies, Publisher_ID) VALUES
('Harry Potter and the Philosopher''s Stone', '9780747532743', '1st', 'Fantasy', 10, 9, 1),
('1984', '9780451524935', '1st', 'Dystopian', 5, 4, 2),
('Malgudi Days', '9780140101779', '2nd', 'Fiction', 3, 3, 1),
('Murder on the Orient Express', '9780007119318', '3rd', 'Mystery', 6, 6, 4),
('Five Point Someone', '9788129104595', '1st', 'Drama', 8, 8, 1),
('Adventures of Tom Sawyer', '9780143039563', '2nd', 'Classic', 5, 5, 3);

-- 🔗 BOOK–AUTHOR RELATIONSHIP
INSERT INTO Book_Author (Book_ID, Author_ID) VALUES
(1, 1), -- HP → J.K. Rowling
(2, 2), -- 1984 → George Orwell
(3, 3), -- Malgudi Days → R.K. Narayan
(4, 4), -- Murder on the Orient Express → Agatha Christie
(5, 5), -- Five Point Someone → Chetan Bhagat
(6, 6); -- Tom Sawyer → Mark Twain

-- 🧾 TRANSACTIONS & BORROW RECORDS

-- Transaction 1: John Doe borrows "Harry Potter" today
INSERT INTO `Transaction` (Issue_Date, Due_Date)
VALUES (CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY));
INSERT INTO Borrow (Member_ID, Book_ID, Transaction_ID, Staff_ID, Remarks)
VALUES (1, 1, 1, 1, 'Issued at main counter');

UPDATE Book SET Available_Copies = Available_Copies - 1 WHERE Book_ID = 1;

-- Transaction 2: Anita Kumar borrowed "1984" 10 days ago
INSERT INTO `Transaction` (Issue_Date, Due_Date)
VALUES (DATE_SUB(CURDATE(), INTERVAL 10 DAY), DATE_SUB(CURDATE(), INTERVAL 3 DAY));
INSERT INTO Borrow (Member_ID, Book_ID, Transaction_ID, Staff_ID, Remarks)
VALUES (2, 2, 2, 2, 'Issued earlier this month');

UPDATE Book SET Available_Copies = Available_Copies - 1 WHERE Book_ID = 2;

-- Transaction 3: Sneha Roy borrowed "Murder on the Orient Express"
INSERT INTO `Transaction` (Issue_Date, Due_Date)
VALUES (CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY));
INSERT INTO Borrow (Member_ID, Book_ID, Transaction_ID, Staff_ID, Remarks)
VALUES (4, 4, 3, 5, 'Issued mystery section');

UPDATE Book SET Available_Copies = Available_Copies - 1 WHERE Book_ID = 4;

-- Transaction 4: David Miller borrowed "Adventures of Tom Sawyer" 5 days ago
INSERT INTO `Transaction` (Issue_Date, Due_Date)
VALUES (DATE_SUB(CURDATE(), INTERVAL 5 DAY), DATE_ADD(CURDATE(), INTERVAL 2 DAY));
INSERT INTO Borrow (Member_ID, Book_ID, Transaction_ID, Staff_ID, Remarks)
VALUES (5, 6, 4, 4, 'Borrowed from children''s section');

UPDATE Book SET Available_Copies = Available_Copies - 1 WHERE Book_ID = 6;

-- 📅 RESERVATION DATA
INSERT INTO Reservation (Member_ID, Book_ID, Reservation_Date, Status) VALUES
(3, 3, CURDATE(), 'Active'),           -- Ramesh reserves Malgudi Days
(1, 2, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'Active'), -- John reserves 1984
(6, 5, CURDATE(), 'Pending'),          -- Amit reserves Five Point Someone
(4, 1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'Active'); -- Sneha reserves HP
-- SELECT * FROM Member;
  SELECT * FROM Book;
-- SELECT * FROM Borrow;
-- SELECT * FROM Reservation;
-- SELECT * FROM Book_Author;

-- 1️⃣ SHOW BOOKS WITH AUTHORS AND PUBLISHERS
-- Demonstrates complex JOIN across multiple tables
/*SELECT 
    b.Book_ID,
    b.Title,
    a.Name AS Author_Name,
    p.Name AS Publisher_Name,
    b.Genre,
    b.Total_Copies,
    b.Available_Copies
FROM Book b
JOIN Book_Author ba ON b.Book_ID = ba.Book_ID
JOIN Author a ON ba.Author_ID = a.Author_ID
JOIN Publisher p ON b.Publisher_ID = p.Publisher_ID
ORDER BY b.Title;*/
-- 2️⃣ MEMBERS WHO CURRENTLY BORROWED BOOKS (JOIN + CONDITIONS)
/*SELECT 
    br.Borrow_ID,
    CONCAT(m.First_Name, ' ', m.Last_Name) AS Member_Name,
    b.Title AS Borrowed_Book,
    t.Issue_Date,
    t.Due_Date,
    t.Return_Date,
    s.Name AS Processed_By
FROM Borrow br
JOIN Member m ON br.Member_ID = m.Member_ID
JOIN Book b ON br.Book_ID = b.Book_ID
JOIN `Transaction` t ON br.Transaction_ID = t.Transaction_ID
LEFT JOIN Staff s ON br.Staff_ID = s.Staff_ID
WHERE t.Return_Date IS NULL
ORDER BY t.Due_Date;*/
-- 3️⃣ UPDATE: ADD A RETURN DATE & FINE (simulate a book being returned late)
/*UPDATE `Transaction`
SET Return_Date = CURDATE(),
    Fine = 50.00
WHERE Transaction_ID = 2;  -- Example: Anita returned "1984" late

-- After update, verify
SELECT Transaction_ID, Issue_Date, Due_Date, Return_Date, Fine FROM `Transaction`;*/

/*-- 4️⃣ BOOK AVAILABILITY SUMMARY (using the view)
SELECT * FROM Book_Summary;*/
-- 5️⃣ COUNT BOOKS BY GENRE (Aggregation + GROUP BY)
/*SELECT 
    Genre, 
    COUNT(Book_ID) AS Number_of_Titles, 
    SUM(Total_Copies) AS Total_Copies,
    SUM(Available_Copies) AS Available_Copies
FROM Book
GROUP BY Genre;*/
-- 6️⃣ ACTIVE RESERVATIONS WITH MEMBER DETAILS
/*SELECT 
    r.Reservation_ID,
    CONCAT(m.First_Name, ' ', m.Last_Name) AS Member_Name,
    b.Title AS Reserved_Book,
    r.Reservation_Date,
    r.Status
FROM Reservation r
JOIN Member m ON r.Member_ID = m.Member_ID
JOIN Book b ON r.Book_ID = b.Book_ID
WHERE r.Status = 'Active';*/
-- 7️⃣ MEMBERS WHO HAVE OVERDUE BOOKS (Due date < today and not yet returned)
/*SELECT 
    CONCAT(m.First_Name, ' ', m.Last_Name) AS Member_Name,
    b.Title AS Overdue_Book,
    t.Due_Date,
    DATEDIFF(CURDATE(), t.Due_Date) AS Days_Overdue,
    IF(DATEDIFF(CURDATE(), t.Due_Date) > 0, 'Overdue', 'On Time') AS Status
FROM Borrow br
JOIN Member m ON br.Member_ID = m.Member_ID
JOIN Book b ON br.Book_ID = b.Book_ID
JOIN `Transaction` t ON br.Transaction_ID = t.Transaction_ID
WHERE t.Return_Date IS NULL AND t.Due_Date < CURDATE();*/
-- 8️⃣ SHOW TOP 3 MOST BORROWED BOOKS (Aggregation + ORDER + LIMIT)
/*SELECT 
    b.Title,
    COUNT(br.Borrow_ID) AS Times_Borrowed
FROM Borrow br
JOIN Book b ON br.Book_ID = b.Book_ID
GROUP BY b.Book_ID
ORDER BY Times_Borrowed DESC
LIMIT 3;*/
-- 9️⃣ DELETE A CANCELLED RESERVATION (DML DELETE example)
-- Let's assume Reservation_ID = 1 has status 'Cancelled'
/*DELETE FROM Reservation 
WHERE Reservation_ID = 1 AND Status = 'Cancelled';

-- Verify
SELECT * FROM Reservation;*/


USE library_db;

-- ======================================================================
-- PART 1: TRIGGERS
-- ======================================================================

-- 1️⃣ Trigger to automatically reduce Available_Copies when a book is borrowed
DELIMITER //
CREATE TRIGGER trg_borrow_before_insert
BEFORE INSERT ON Borrow
FOR EACH ROW
BEGIN
    DECLARE avail INT;
    SELECT Available_Copies INTO avail
    FROM Book
    WHERE Book_ID = NEW.Book_ID;
    
    IF avail <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Book not available for borrowing';
    ELSE
        UPDATE Book
        SET Available_Copies = Available_Copies - 1
        WHERE Book_ID = NEW.Book_ID;
    END IF;
END;
//
DELIMITER ;

-- 2️⃣ Trigger to increase Available_Copies when a book is returned
DELIMITER //
CREATE TRIGGER trg_return_after_update
AFTER UPDATE ON `Transaction`
FOR EACH ROW
BEGIN
    IF OLD.Return_Date IS NULL AND NEW.Return_Date IS NOT NULL THEN
        UPDATE Book
        JOIN Borrow br ON br.Book_ID = Book.Book_ID AND br.Transaction_ID = NEW.Transaction_ID
        SET Book.Available_Copies = Book.Available_Copies + 1;
    END IF;
END;
//
DELIMITER ;

-- 3️⃣ Trigger to prevent deletion of members who have active borrowings
DELIMITER //
CREATE TRIGGER trg_member_before_delete
BEFORE DELETE ON Member
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1
        FROM Borrow br
        JOIN `Transaction` t ON br.Transaction_ID = t.Transaction_ID
        WHERE br.Member_ID = OLD.Member_ID AND t.Return_Date IS NULL
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot delete member with active borrowed books';
    END IF;
END;
//
DELIMITER ;

-- ======================================================================
-- PART 2: STORED PROCEDURES
-- ======================================================================

-- 1️⃣ Procedure to borrow a book (insert borrow record + transaction)
DELIMITER //
CREATE PROCEDURE sp_borrow_book(
    IN p_member INT,
    IN p_book INT,
    IN p_staff INT
)
BEGIN
    DECLARE v_due DATE;
    SET v_due = DATE_ADD(CURDATE(), INTERVAL 7 DAY);
    
    -- Insert transaction
    INSERT INTO `Transaction` (Issue_Date, Due_Date)
    VALUES (CURDATE(), v_due);
    
    -- Get last transaction id
    SET @t_id = LAST_INSERT_ID();
    
    -- Insert borrow record
    INSERT INTO Borrow (Member_ID, Book_ID, Transaction_ID, Staff_ID, Remarks)
    VALUES (p_member, p_book, @t_id, p_staff, 'Issued via procedure');
END;
//
DELIMITER ;

-- 2️⃣ Procedure to return a book (update transaction)
DELIMITER //
CREATE PROCEDURE sp_return_book(
    IN p_transaction INT,
    IN p_fine DECIMAL(8,2)
)
BEGIN
    UPDATE `Transaction`
    SET Return_Date = CURDATE(),
        Fine = p_fine
    WHERE Transaction_ID = p_transaction;
END;
//
DELIMITER ;

-- ======================================================================
-- PART 3: FUNCTIONS
-- ======================================================================

-- 1️⃣ Function to calculate fine based on due date
DELIMITER //
CREATE FUNCTION fn_calculate_fine(p_due DATE) RETURNS DECIMAL(8,2)
DETERMINISTIC
BEGIN
    DECLARE v_days INT;
    DECLARE v_fine DECIMAL(8,2);
    
    SET v_days = DATEDIFF(CURDATE(), p_due);
    
    IF v_days > 0 THEN
        SET v_fine = v_days * 10; -- Rs.10 per day
    ELSE
        SET v_fine = 0;
    END IF;
    
    RETURN v_fine;
END;
//
DELIMITER ;

-- 2️⃣ Function to get total books currently borrowed by a member
DELIMITER //
CREATE FUNCTION fn_books_borrowed(p_member INT) RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE v_count INT;
    SELECT COUNT(*) INTO v_count
    FROM Borrow br
    JOIN `Transaction` t ON br.Transaction_ID = t.Transaction_ID
    WHERE br.Member_ID = p_member AND t.Return_Date IS NULL;
    
    RETURN v_count;
END;
//
DELIMITER ;
-- ✅ Borrow a book using procedure
-- CALL sp_borrow_book(3, 1, 1); -- Member_ID=3, Book_ID=1, Staff_ID=1

-- ✅ Return a book using procedure (calculate fine first)
-- SELECT fn_calculate_fine(Due_Date) FROM `Transaction` WHERE Transaction_ID=2;
CALL sp_return_book(2, 50.00);

-- ✅ Check books currently borrowed by a member
-- SELECT fn_books_borrowed(1) AS Books_Borrowed; -- Member_ID=1

-- ✅ Trigger test: try deleting member with active borrowings
-- DELETE FROM Member WHERE Member_ID=1; -- Should raise error

-- ✅ Trigger test: available copies update automatically
--  SELECT * FROM Book WHERE Book_ID=1;

-- ======================================================================
-- REVIEW 3: ADDITIONAL TRIGGERS, PROCEDURES, FUNCTIONS
-- ======================================================================

USE library_db;

-- ======================================================================
-- PART 1: TRIGGERS
-- ======================================================================

-- 1️⃣ Auto-cancel stale reservations (>3 days)
DROP TRIGGER IF EXISTS trg_cancel_reservation;
DELIMITER //
CREATE TRIGGER trg_cancel_reservation
BEFORE UPDATE ON Reservation
FOR EACH ROW
BEGIN
    IF OLD.Status = 'Active' AND DATEDIFF(CURDATE(), OLD.Reservation_Date) > 3 THEN
        SET NEW.Status = 'Cancelled';
    END IF;
END;
//
DELIMITER ;

-- 2️⃣ Prevent deletion of books currently borrowed
DROP TRIGGER IF EXISTS trg_prevent_book_delete;
DELIMITER //
CREATE TRIGGER trg_prevent_book_delete
BEFORE DELETE ON Book
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1
        FROM Borrow br
        JOIN `Transaction` t ON br.Transaction_ID = t.Transaction_ID
        WHERE br.Book_ID = OLD.Book_ID AND t.Return_Date IS NULL
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot delete book currently borrowed by a member';
    END IF;
END;
//
DELIMITER ;

-- 3️⃣ Downgrade member if 3+ overdue books
DROP TRIGGER IF EXISTS trg_member_overdue_status;
DELIMITER //
CREATE TRIGGER trg_member_overdue_status
AFTER UPDATE ON `Transaction`
FOR EACH ROW
BEGIN
    DECLARE overdue_count INT;
    
    SELECT COUNT(*)
    INTO overdue_count
    FROM Borrow br
    JOIN `Transaction` t ON br.Transaction_ID = t.Transaction_ID
    WHERE br.Member_ID = (SELECT Member_ID FROM Borrow WHERE Transaction_ID = NEW.Transaction_ID)
      AND t.Return_Date IS NULL
      AND t.Due_Date < CURDATE();
      
    IF overdue_count >= 3 THEN
        UPDATE Member
        SET Membership_Type = 'Regular'
        WHERE Member_ID = (SELECT Member_ID FROM Borrow WHERE Transaction_ID = NEW.Transaction_ID);
    END IF;
END;
//
DELIMITER ;

-- ======================================================================
-- PART 2: STORED PROCEDURES
-- ======================================================================

-- 1️⃣ Extend due date of borrowed book
DROP PROCEDURE IF EXISTS sp_extend_due_date;
DELIMITER //
CREATE PROCEDURE sp_extend_due_date(
    IN p_transaction INT,
    IN p_extra_days INT
)
BEGIN
    UPDATE `Transaction`
    SET Due_Date = DATE_ADD(Due_Date, INTERVAL p_extra_days DAY)
    WHERE Transaction_ID = p_transaction;
END;
//
DELIMITER ;

-- 2️⃣ List all overdue books for a member
DROP PROCEDURE IF EXISTS sp_member_overdue_books;
DELIMITER //
CREATE PROCEDURE sp_member_overdue_books(
    IN p_member INT
)
BEGIN
    SELECT b.Title, t.Due_Date, DATEDIFF(CURDATE(), t.Due_Date) AS Days_Overdue
    FROM Borrow br
    JOIN `Transaction` t ON br.Transaction_ID = t.Transaction_ID
    JOIN Book b ON br.Book_ID = b.Book_ID
    WHERE br.Member_ID = p_member AND t.Return_Date IS NULL AND t.Due_Date < CURDATE();
END;
//
DELIMITER ;

-- 3️⃣ Promote Regular member to Premium if no overdue books
DROP PROCEDURE IF EXISTS sp_promote_member;
DELIMITER //
CREATE PROCEDURE sp_promote_member(IN p_member INT)
BEGIN
    DECLARE overdue_count INT;
    
    SELECT COUNT(*) INTO overdue_count
    FROM Borrow br
    JOIN `Transaction` t ON br.Transaction_ID = t.Transaction_ID
    WHERE br.Member_ID = p_member AND t.Return_Date IS NULL AND t.Due_Date < CURDATE();
    
    IF overdue_count = 0 THEN
        UPDATE Member
        SET Membership_Type = 'Premium'
        WHERE Member_ID = p_member;
    END IF;
END;
//
DELIMITER ;

-- ======================================================================
-- PART 3: FUNCTIONS
-- ======================================================================

-- 1️⃣ Total overdue days for a member
DROP FUNCTION IF EXISTS fn_total_overdue_days;
DELIMITER //
CREATE FUNCTION fn_total_overdue_days(p_member INT) RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE v_days INT;
    SELECT IFNULL(SUM(DATEDIFF(CURDATE(), Due_Date)),0) INTO v_days
    FROM Borrow br
    JOIN `Transaction` t ON br.Transaction_ID = t.Transaction_ID
    WHERE br.Member_ID = p_member AND t.Return_Date IS NULL AND t.Due_Date < CURDATE();
    
    RETURN v_days;
END;
//
DELIMITER ;

-- 2️⃣ Most reserved book
DROP FUNCTION IF EXISTS fn_most_reserved_book;
DELIMITER //
CREATE FUNCTION fn_most_reserved_book() RETURNS VARCHAR(255)
DETERMINISTIC
BEGIN
    DECLARE book_title VARCHAR(255);
    
    SELECT b.Title INTO book_title
    FROM Reservation r
    JOIN Book b ON r.Book_ID = b.Book_ID
    GROUP BY r.Book_ID
    ORDER BY COUNT(r.Reservation_ID) DESC
    LIMIT 1;
    
    RETURN book_title;
END;
//
DELIMITER ;

-- 3️⃣ Can a member borrow more books?
DROP FUNCTION IF EXISTS fn_can_borrow;
DELIMITER //
CREATE FUNCTION fn_can_borrow(p_member INT) RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE borrow_count INT;
    DECLARE max_limit INT;

    SELECT COUNT(*) INTO borrow_count
    FROM Borrow br
    JOIN `Transaction` t ON br.Transaction_ID = t.Transaction_ID
    WHERE br.Member_ID = p_member AND t.Return_Date IS NULL;

    SELECT CASE 
            WHEN Membership_Type='Premium' THEN 10
            ELSE 5
           END INTO max_limit
    FROM Member
    WHERE Member_ID = p_member;

    RETURN borrow_count < max_limit;
END;
//
DELIMITER ;

-- ======================================================================
-- PART 4: DEMONSTRATION QUERIES
-- ======================================================================

-- View overdue books for member 1
--  CALL sp_member_overdue_books(1);

-- Extend due date for a transaction

CALL sp_extend_due_date(2, 5);

-- Promote a member if no overdue books
-- CALL sp_promote_member(3);

-- Get total overdue days for a member
--  SELECT fn_total_overdue_days(1) AS Total_Overdue_Days;

-- Get most reserved book
-- SELECT fn_most_reserved_book() AS Most_Reserved_Book;

-- Check if a member can borrow more books
-- SELECT fn_can_borrow(2) AS Can_Borrow;


SET sql_notes = 0;


-- ==============================
-- PROCEDURE: Add a new reservation (Fixed ✅)
-- ==============================
DROP PROCEDURE IF EXISTS sp_add_reservation;
DELIMITER //
CREATE PROCEDURE sp_add_reservation (
  IN p_member_id INT,
  IN p_book_id INT
)
BEGIN
  INSERT INTO Reservation (Member_ID, Book_ID, Reservation_Date, Status)
  VALUES (p_member_id, p_book_id, NOW(), 'Active');
END //
DELIMITER ;

-- ==============================
-- PROCEDURE: Cancel reservation (Correct ✅)
-- ==============================
DROP PROCEDURE IF EXISTS sp_cancel_reservation;
DELIMITER //
CREATE PROCEDURE sp_cancel_reservation (
  IN p_reservation_id INT
)
BEGIN
  UPDATE Reservation
  SET Status = 'Cancelled'
  WHERE Reservation_ID = p_reservation_id;
END //
DELIMITER ;
