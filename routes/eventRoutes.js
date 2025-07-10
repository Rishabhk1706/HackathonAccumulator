import express from "express";
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent
} from "../controllers/eventController.js";
import {auth} from "../middleware/authMiddleware.js"

const router = express.Router();

router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.post("/",auth, createEvent);
router.put("/:id",auth, updateEvent);
router.delete("/:id",auth, deleteEvent);
router.post("/:id/register", auth, registerForEvent);

export default router;
