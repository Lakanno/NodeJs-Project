import express from "express";
import { getAllUsers, getUserById } from "../controllers/userController.js";
import { authMiddleware, getAuthorizedUsers } from "../middleware/authMiddleware.js";

import {
  get_user_list,
  get_branch_list,
  get_position_list,
  get_contract_type_list,
  get_module_list,
  get_role_modules,
} from "../controllers/userController.js";

// MSSQL
const router = express.Router();
router.get("/get_user_list", get_user_list);
router.get("/get_branch_list", get_branch_list);
router.get("/get_position_list", get_position_list);
router.get("/get_contract_type_list", get_contract_type_list);
router.get("/get_module_list", get_module_list);
router.get("/get_role_modules/:roleId", get_role_modules);

// MYSQL
router.get("/users", authMiddleware, getAllUsers);
router.get("/users/:id", authMiddleware, getUserById);
router.get("/authorized-users", authMiddleware, getAuthorizedUsers);

export default router;
