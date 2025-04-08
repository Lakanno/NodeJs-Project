import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import facebookAuthRoutes from "./routes/facebookAuthRoutes.js";
import { redirectIfAuthenticated } from "./middleware/redirectIfAuthenticated.js";
import { verifyToken } from "./helpers/jwt.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../src/views")); // 📁 folder for ejs templates

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use(cookieParser());
app.get("/login", redirectIfAuthenticated, (req, res) => {
  res.render("login");
});

app.get("/register", redirectIfAuthenticated, (req, res) => {
  res.render("register");
});

app.get("/", (req, res) => {
  // res.send("Welcome to the API!");
  res.redirect("/login");
  // res.render('home',  { name: 'Friend' });
});

// მომხმარებლების როუტები
app.use("/api", userRoutes);
app.use(facebookAuthRoutes);
app.use(homeRoutes);
// ბოლო როუტი: თუ არაფერი დაემთხვა ზემოთ
app.use("*", (req, res) => {
  const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.redirect("/login");
  }

  const decoded = verifyToken(token);

  if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
    return res.redirect("/login");
  }

  // მომხმარებელი ავტორიზებულია
  res.redirect("/home");
});

export default app;
