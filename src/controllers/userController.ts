import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/UserModel.js";
import { UserModelMSSQL } from "../models/UserModelMSSQL.js";

// MSSQL
export const get_user_list = async (req: Request, res: Response): Promise<void> => {
  try {
    const skip = parseInt(req.query.skip as string) || 0;
    const fetch = parseInt(req.query.fetch as string) || 50;
    const lastName = req.query.lastName as string;
    const branchId = req.query.branchId ? parseInt(req.query.branchId as string) : undefined;
    const users = await UserModelMSSQL.getUserList(skip, fetch, lastName, branchId);

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in get_user_list controller:", error);
    res.status(500).json({ error: "Failed to fetch user list" });
  }
};

export const get_branch_list = async (req: Request, res: Response): Promise<void> => {
  try {
    const branches = await UserModelMSSQL.getBranchList();
    res.status(200).json(branches);
  } catch (error) {
    console.error("Error in get_branch_list controller:", error);
    res.status(500).json({ error: "Failed to fetch branch list" });
  }
};

export const get_position_list = async (req: Request, res: Response): Promise<void> => {
  try {
    const positions = await UserModelMSSQL.getPositionList();
    res.status(200).json(positions);
  } catch (error) {
    console.error("Error in get_position_list controller:", error);
    res.status(500).json({ error: "Failed to fetch position list" });
  }
};

export const get_contract_type_list = async (req: Request, res: Response): Promise<void> => {
  try {
    const contractTypes = await UserModelMSSQL.getContractTypeList();
    res.status(200).json(contractTypes);
  } catch (error) {
    console.error("Error in get_contract_type_list controller:", error);
    res.status(500).json({ error: "Failed to fetch contract type list" });
  }
};

export const get_module_list = async (req: Request, res: Response): Promise<void> => {
  try {
    const modules = await UserModelMSSQL.getModuleList();
    res.status(200).json(modules);
  } catch (error) {
    console.error("Error in get_module_list controller:", error);
    res.status(500).json({ error: "Failed to fetch module list" });
  }
};

export const get_role_modules = async (req: Request, res: Response): Promise<void> => {
  try {
    const roleId = parseInt(req.params.roleId, 10);
    if (isNaN(roleId)) {
      res.status(400).json({ error: "Invalid roleId parameter" });
      return;
    }

    const modules = await UserModelMSSQL.getRoleModules(roleId);
    res.status(200).json(modules);
  } catch (error) {
    console.error("Error in get_role_modules controller:", error);
    res.status(500).json({ error: "Failed to fetch role modules" });
  }
};

// MYSQL
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
