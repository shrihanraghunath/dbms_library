import express from "express";
import {
  getAllMembers,
  addMember,
  deleteMember,
} from "../controllers/memberController.js";

const router = express.Router();

router.get("/", getAllMembers);
router.post("/", addMember);
router.delete("/:id", deleteMember);

export default router;
