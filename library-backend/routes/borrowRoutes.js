import express from "express";
import { getBorrowedBooks, borrowBook } from "../controllers/borrowController.js";

const router = express.Router();

// Fetch all current borrow records
router.get("/", getBorrowedBooks);

// Borrow a new book
router.post("/", borrowBook);

export default router;
