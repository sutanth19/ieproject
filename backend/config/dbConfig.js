// config/dbConfig.js
import sql from "mssql";

const dbConfig = {
  user: process.env.DB_USER || "sutanth30",
  password: process.env.DB_PASSWORD || "Sut@nthN3005",
  server: process.env.DB_SERVER || "MYPENM0IESVR02\\SQLEXPRESS",
  database: process.env.DB_DATABASE || "IEPortalDB", // DB Name
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export async function connectDB() {
  try {
    await sql.connect(dbConfig);
    // Debug: Verify the connection by checking the current database name.
    const request = new sql.Request();
    const result = await request.query("SELECT DB_NAME() AS CurrentDB");
    console.log("Connected to SQL Server! Current DB:", result.recordset[0].CurrentDB);
  } catch (err) {
    console.error("Ooops! Database Connection Failed!", err);
    process.exit(1); // Exit if connection fails
  }
}

export default dbConfig;
