import { ensureAuthenticated } from "../middleware/authMiddleware.js";
import express from "express";

const router = express.Router();

// თუ მომხმარებელი ავტორიზებულია, ვგზავნით მის მონაცემებს
router.get("/home", ensureAuthenticated, (req, res) => {
  // აქ აღარ არის საჭირო any გამოყენება, რადგან req.user უკვე სწორად ტიპიზირებულია
  const user = req.user;
  res.render("home", { name: user?.id, email: user?.email });
});
export default router;
