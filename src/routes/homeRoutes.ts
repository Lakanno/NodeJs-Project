import express from "express";

const router = express.Router();

router.get("/home", (req, res) => {
  const { name, token } = req.query;
  res.render("home", { name, token });
});

export default router;
