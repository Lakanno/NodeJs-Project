import { body } from "express-validator";

export const registerValidation = [
  body("first_name").notEmpty().withMessage("First name is required").isString().withMessage("First name must be a string"),

  body("last_name").notEmpty().withMessage("Last name is required").isString().withMessage("Last name must be a string"),

  body("email").isEmail().withMessage("Invalid email format"),

  body("username").notEmpty().withMessage("Username is required").isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),

  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Invalid email format"), // Email ვალიდაცია
  body("password").notEmpty().withMessage("Password is required"), // პაროლი არ უნდა იყოს ცარიელი
];
