import express from "express";
import { getAllUsers, getUserById } from "../controllers/userController.js";
import { authMiddleware, getAuthorizedUsers } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users", authMiddleware, getAllUsers);
router.get("/users/:id", authMiddleware, getUserById);
router.get("/authorized-users", authMiddleware, getAuthorizedUsers);

export default router;
