import pool from "../config/db.js";

export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
}

export class UserModel {
  static async createUser(user: User): Promise<unknown> {
    const { name, email, password } = user;
    const [result] = await pool.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, password]);
    return result;
  }

  static async findUserByEmail(email: string): Promise<unknown> {
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
    return (rows as never)[0]; // ვაბრუნებთ მხოლოდ პირველ შედეგს
  }
}
