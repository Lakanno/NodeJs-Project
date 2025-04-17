import { ensureAuthenticated } from "../middleware/authMiddleware.js";
import express from "express";

const router = express.Router();

// თუ მომხმარებელი ავტორიზებულია, ვგზავნით მის მონაცემებს
router.get("/home", ensureAuthenticated, (req, res) => {
  const user = req.user;
  res.render("home", { name: user?.id });
});
export default router;
