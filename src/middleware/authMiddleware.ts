import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { verifyToken } from "../helpers/jwt.js"; // ჩვენი JWT ფუნქციები

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // ტოკენის აღება ჰედერიდან
  console.log("🔍 🔍 🔍 req.headers", req.headers);
  const token = req.headers["authorization"]?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    res.status(401).json({ message: "Token is required" });
    return;
  }

  // ტოკენის ვალიდაცია
  const decoded = verifyToken(token);
  console.log("🔍 🔍 🔍 decoded", decoded);

  if (!decoded) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
  (req as Request & { user?: unknown }).user = decoded;
  next();
};

// export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
//   const token = req.header("Authorization")?.split(" ")[1];
//   if (!token) {
//     res.status(401).json({ message: "Unauthorized" });
//     return;
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
//     (req as Request & { user?: unknown }).user = decoded;
//     next();
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};
