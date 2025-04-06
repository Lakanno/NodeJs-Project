import express from "express";
import passport from "../config/passport.js";

const router = express.Router();

// Facebook ავტორიზაციის ინიციალიზაცია
router.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));

// Callback როუტი
router.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), (req, res) => {
  // წარმატებული ავტორიზაციის შემდეგ
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { token } = req.user as any;
  res.json({ message: "Successfully logged in with Facebook!", token });
});

export default router;
