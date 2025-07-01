import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from "../controllers/userController.js";
import {auth} from "../middleware/authMiddleware.js"

const router = express.Router();

router.get("/",auth, getAllUsers);
router.get("/:id",auth, getUserById);
router.put("/:id",auth, updateUser);
router.delete("/:id",auth, deleteUser);

export default router;
