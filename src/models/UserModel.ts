import pool from "../config/db.js";

export interface User {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  is_active?: boolean;
  create_date?: Date;
  modify_date?: Date;
}

export class UserModel {
  static async createUser(user: User): Promise<unknown> {
    const { first_name, last_name, email, username, password } = user;
    const [result] = await pool.execute(
      `INSERT INTO users (first_name, last_name, email, username, password, is_active, create_date, modify_date) 
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [first_name, last_name, email, username, password, true],
    );
    return result;
  }

  static async findUserByEmail(email: string): Promise<unknown> {
    const [rows] = await pool.execute(`SELECT * FROM users WHERE email = ?`, [email]);
    return (rows as never)[0]; // პირველ ელემენტს ვაბრუნებთ, რადგან rows array-ია.
  }
  static async findUserByUsernameOrEmail(username: string, email: string) {
    const [rows] = await pool.execute("SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1", [username, email]);
    return (rows as unknown[]).length ? (rows as unknown[])[0] : null;
  }

  static async getUserById(id: number): Promise<unknown> {
    const [rows] = await pool.execute(`SELECT * FROM users WHERE id = ?`, [id]);
    return (rows as never)[0];
  }
  static async getAllUsers() {
    const [rows] = await pool.query("SELECT id, first_name, last_name, email, username, is_active FROM users");
    return rows;
  }
}
