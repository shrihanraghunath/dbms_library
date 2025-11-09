import express from "express";
import {
  calculateFine,
  booksBorrowed,
  totalOverdueDays,
  mostReservedBook,
  canBorrow,
  borrowBook,
  returnBook,
  extendDueDate,
  overdueBooks,
  promoteMember,
} from "../controllers/utilController.js";

const router = express.Router();

// -------------------- 🔹 SQL FUNCTIONS --------------------
router.get("/fn_calculate_fine/:dueDate", calculateFine);
router.get("/fn_books_borrowed/:memberId", booksBorrowed);
router.get("/fn_total_overdue_days/:memberId", totalOverdueDays);
router.get("/fn_most_reserved_book", mostReservedBook);
router.get("/fn_can_borrow/:memberId", canBorrow);

// -------------------- 🔹 STORED PROCEDURES --------------------
router.post("/sp_borrow_book", borrowBook);
router.post("/sp_return_book", returnBook);
router.post("/sp_extend_due_date", extendDueDate);
router.get("/sp_member_overdue_books/:memberId", overdueBooks);
router.post("/sp_promote_member", promoteMember);

export default router;
