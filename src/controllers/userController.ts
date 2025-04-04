import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/UserModel.js";

// export const getAuthorizedUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const userId = (req as Request & { user?: { id: string; } }).user?.id ?? null;  // ავტორიზებული მომხმარებლის id, რომელიც მივიღეთ JWT-დან

//     if (!userId) {
//       res.status(400).json({ message: "User not found" });
//       return;
//     }

//     // აქ ხორციელდება მომხმარებლის პოვნა
//     const user = await UserModel.findUserById(userId);

//     if (!user) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }

//     res.json(user);
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };

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
