import express from "express";
import {
  getReturns,
  returnBook,
  calculateFine,
} from "../controllers/returnController.js";

const router = express.Router();

router.get("/", getReturns);
router.post("/", returnBook);

// Example: /api/returns/fine/2025-11-04
router.get("/fine/:due_date", calculateFine);

export default router;
