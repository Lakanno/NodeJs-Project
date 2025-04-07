import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { verifyToken } from "../helpers/jwt.js";

const authorizedUsers: Set<string> = new Set();

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

  if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }

  authorizedUsers.add(decoded.id as string);

  (req as Request & { user?: unknown }).user = decoded;
  next();
};
export const getAuthorizedUsers = (req: Request, res: Response): void => {
  res.json({ authorizedUsers: Array.from(authorizedUsers) });
};
export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const token = (req.query.token as string) || req.cookies?.token || ""; // თუ cookies იყენებ, შეგიძლია იქიდანაც ამოიღო

  if (!token) return res.redirect("/login");

  const decoded = verifyToken(token);
  if (!decoded) return res.redirect("/login");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req as any).user = decoded;
  next();
};
