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
