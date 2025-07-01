import express from "express";
import {
  getAllMatchRequests,
  getMatchRequestById,
  createMatchRequest,
  updateMatchRequest,
  deleteMatchRequest
} from "../controllers/matchRequestController.js";
import {auth} from "../middleware/authMiddleware.js"

const router = express.Router();

router.get("/", getAllMatchRequests);
router.get("/:id", getMatchRequestById);
router.post("/",auth, createMatchRequest);
router.put("/:id",auth, updateMatchRequest);
router.delete("/:id",auth, deleteMatchRequest);

export default router;