import sql from "mssql/msnodesqlv8.js"; // Import the mssql library
import dotenv from "dotenv";
dotenv.config();

const config = {
  server: process.env.MSSQL_HOST || "localhost", // your SQL server IP with a default value
  database: process.env.MSSQL_DATABASE || "master", // your database name with a default value
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true,
    enableArithAbort: true,
    trustServerCertificate: true,
  },
};

const pool = sql.connect(config);

export default pool;
