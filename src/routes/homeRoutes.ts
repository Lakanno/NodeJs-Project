import { ensureAuthenticated } from "../middleware/authMiddleware.js";
import express from "express";

const router = express.Router();
router.get("/home", ensureAuthenticated, (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = (req as any).user;
  res.render("home", { name: user.name });
});
export default router;
