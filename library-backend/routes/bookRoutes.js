import express from "express";
import {
  getAllBooks,
  addBook,
  deleteBook,
} from "../controllers/bookController.js";

const router = express.Router();

// ✅ Get all books
router.get("/", getAllBooks);

// ✅ Add a book
router.post("/", addBook);

// ✅ Delete a book
router.delete("/:id", deleteBook);

export default router;
