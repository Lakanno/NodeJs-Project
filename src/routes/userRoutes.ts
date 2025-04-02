import express from "express";
import { getAllUsers, getUserById } from "../controllers/userController.js";

const router = express.Router();

// ყველა მომხმარებლის წამოღება
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);

export default router;
