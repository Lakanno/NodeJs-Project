import pool from "../config/mssql.js";

export class UserModelMSSQL {
  static async getUserList(skip: number, fetch: number, lastName?: string, branchId?: number) {
    try {
      const connection = await pool;
      const request = connection.request();

      // პარამეტრების დამატება SQL ინექციის თავიდან ასაცილებლად
      request.input("skip", skip);
      request.input("fetch", fetch);

      if (lastName) {
        request.input("lastName", lastName);
      }
      if (branchId) {
        request.input("branchId", branchId);
      }

      // SQL მოთხოვნა
      const query = `
        SELECT 
          username, 
          firstName, 
          lastName, 
          branchId, 
          dbo.Branch.title AS branchTitle, 
          dbo.UserRole.name AS roleName, 
          Branch.isActive
        FROM dbo.UserProfile 
        LEFT JOIN dbo.Branch ON dbo.UserProfile.branchId = dbo.Branch.id
        LEFT JOIN dbo.UserRole ON dbo.UserProfile.roleId = dbo.UserRole.id
        ${lastName ? "AND dbo.UserProfile.lastName = @lastName" : ""}
        ${branchId ? "AND dbo.UserProfile.branchId = @branchId" : ""}
        ORDER BY dbo.UserProfile.id ASC
        OFFSET @skip ROWS
        FETCH NEXT @fetch ROWS ONLY;
      `;

      const result = await request.query(query);
      return result.recordset;
    } catch (error) {
      console.error("Error fetching user list:", error);
      throw new Error("Database query failed");
    }
  }

  static async getBranchList() {
    try {
      const connection = await pool;
      const request = connection.request();

      // SQL მოთხოვნა
      const query = `
        SELECT id, title, isActive 
        FROM dbo.Branch;
      `;

      const result = await request.query(query);
      return result.recordset;
    } catch (error) {
      console.error("Error fetching branch list:", error);
      throw new Error("Database query failed");
    }
  }

  static async getPositionList() {
    try {
      const connection = await pool;
      const request = connection.request();

      // SQL მოთხოვნა
      const query = `
        SELECT * 
        FROM dbo.Position;
      `;

      const result = await request.query(query);
      return result.recordset;
    } catch (error) {
      console.error("Error fetching position list:", error);
      throw new Error("Database query failed");
    }
  }

  static async getContractTypeList() {
    try {
      const connection = await pool;
      const request = connection.request();

      // SQL მოთხოვნა
      const query = `
            SELECT * FROM dbo.ContractType;
      `;

      const result = await request.query(query);
      return result.recordset;
    } catch (error) {
      console.error("Error fetching position list:", error);
      throw new Error("Database query failed");
    }
  }

  static async getModuleList() {
    try {
      const connection = await pool;
      const request = connection.request();

      const query = `
        SELECT * 
        FROM dbo.Module;
      `;

      const result = await request.query(query);
      return result.recordset;
    } catch (error) {
      console.error("Error fetching module list:", error);
      throw new Error("Database query failed");
    }
  }

  static async getUserProfileList() {
    try {
      const connection = await pool;
      const request = connection.request();

      const query = `
        SELECT * 
        FROM dbo.UserProfile;
      `;

      const result = await request.query(query);
      return result.recordset;
    } catch (error) {
      console.error("Error fetching user profile list:", error);
      throw new Error("Database query failed");
    }
  }

  static async getRoleModules(roleId: number) {
    try {
      const connection = await pool;
      const request = connection.request();

      request.input("roleId", roleId);

      const query = `
        SELECT dbo.Module.id, moduleName , dbo.RoleModule.isActive
        FROM dbo.Module 
        LEFT JOIN dbo.RoleModule ON dbo.Module.id = dbo.RoleModule.moduleId
        WHERE dbo.RoleModule.roleId = @roleId OR dbo.RoleModule.roleId IS NULL;
      `;

      const result = await request.query(query);
      return result.recordset;
    } catch (error) {
      console.error("Error fetching role modules:", error);
      throw new Error("Database query failed");
    }
  }
}
