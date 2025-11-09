import express from "express";
import { getAllReservations, addReservation, cancelReservation } from "../controllers/reservationController.js";

const router = express.Router();

router.get("/", getAllReservations);
router.post("/", addReservation);
router.delete("/:id", cancelReservation);

export default router;
