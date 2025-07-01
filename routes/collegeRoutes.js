import express from "express";
import {
  getColleges,
  getCollegeById,
  createCollege,
  updateCollege,
  deleteCollege
} from "../controllers/collegeController.js";
import {auth} from "../middleware/authMiddleware.js"

const router = express.Router();

router.get("/", getColleges);
router.get("/:id", getCollegeById);
router.post("/",auth, createCollege);
router.put("/:id",auth, updateCollege);
router.delete("/:id",auth, deleteCollege);

export default router;