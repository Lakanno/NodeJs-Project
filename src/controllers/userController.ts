import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/UserModel.js";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserModel.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // მონაცემების წამოღება ID-ის მიხედვით
    const user = await UserModel.getUserById(req.params.id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
    return;
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
