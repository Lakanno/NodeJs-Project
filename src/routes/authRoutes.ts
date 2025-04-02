import express from "express";
import { login, register } from "../controllers/authController.js";
import { loginValidation, registerValidation } from "../validators/authValidator.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);

export default router;
