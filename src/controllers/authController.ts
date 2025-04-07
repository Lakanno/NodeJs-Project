import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../helpers/jwt.js";

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { first_name, last_name, email, username, password } = req.body;

    const userExists = await UserModel.findUserByUsernameOrEmail(username, email);
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.createUser({ first_name, last_name, email, username, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    if ((error as { code?: string }).code === "ER_DUP_ENTRY") {
      res.status(400).json({ message: "Username or Email already exists" });
    }
    console.error(error);
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // უკვე შემოწმდა ვალიდაცია middleware-ით
    const { email, password } = req.body;

    // მომხმარებლის პოვნა MySQL-ში
    const user = (await UserModel.findUserByEmail(email)) as { id: string; password: string } | null;
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // პაროლის შედარება
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // JWT ტოკენის გენერირება ჩვენი `generateToken` ფუნქციით
    const token = generateToken({ id: user.id });
    console.log("🔍 🔍 🔍 token", token);
    // გადამისამართება `home.ejs`-ზე ტოკენით
    // res.render("home", { name: user.id, token });

    // ტოკენის დაბრუნება
    // res.json({ token });
    // გადამისამართება `/home` როუტზე
    res.redirect(`/home`);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
