import express from "express";
import { getAllUsers } from "../controllers/userController.js";

const router = express.Router();

// ყველა მომხმარებლის წამოღება
router.get("/users", getAllUsers);

export default router;
