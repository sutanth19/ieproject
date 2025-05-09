// backend/routes/users.js
import express from "express";
import sql from "mssql";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM Users");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



export default router;
