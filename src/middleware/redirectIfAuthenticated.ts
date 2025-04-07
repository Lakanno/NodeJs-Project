import { verifyToken } from "../helpers/jwt.js";
import { Request, Response, NextFunction } from "express";

export function redirectIfAuthenticated(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      return res.redirect("/home");
    }
  }

  next();
}
