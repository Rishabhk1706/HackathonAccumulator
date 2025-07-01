import express from "express";
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} from "../controllers/eventController.js";
import {auth} from "../middleware/authMiddleware.js"

const router = express.Router();

router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.post("/",auth, createEvent);
router.put("/:id",auth, updateEvent);
router.delete("/:id",auth, deleteEvent);

export default router;
