// routes/trainingCarousel.js 
import express from "express";
import multer  from "multer";
import path    from "path";
import { v4 as uuidv4 } from "uuid";
import sql     from "mssql";

const router = express.Router();

/*───────────────────────────  Multer setup  ───────────────────────────*/
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/"),
  filename:    (_req, file, cb)  => cb(null, uuidv4() + path.extname(file.originalname))
});
const upload = multer({ storage });

/*─────────────────────────── 1)  CREATE  ──────────────────────────────*/
router.post("/", upload.single("image"), async (req, res) => {
  const { trainingType, title, subTitle } = req.body;
  const imageFileName = req.file ? req.file.filename : null;
  const guid          = uuidv4();                  // NEW ‑‑ generate PK here

  try {
    await new sql.Request()
      .input("guid_id",      sql.UniqueIdentifier, guid)
      .input("trainingType", sql.VarChar(50),      trainingType)
      .input("title",        sql.VarChar(200),     title)
      .input("subTitle",     sql.VarChar(300),     subTitle)
      .input("image",        sql.VarChar(300),     imageFileName)
      .query(`
        INSERT INTO dbo.TrainingCarousel
          (guid_id, trainingType, title, subTitle, image, created_at)
        VALUES
          (@guid_id, @trainingType, @title, @subTitle, @image, GETDATE());
      `);

    res.status(201).json({ message: "Created", guid_id: guid });
  } catch (err) {
    console.error("CREATE error:", err);
    res.status(500).json({ error: err.message });
  }
});

/*─────────────────────────── 2)  READ  ────────────────────────────────*/
router.get("/", async (req, res) => {
  const { type } = req.query;   // e.g. ?type=WORKDAY
  try {
    const reqSql = new sql.Request();
    let query = `
      SELECT guid_id, trainingType, title, subTitle, image, created_at
      FROM dbo.TrainingCarousel
    `;
    if (type) {
      query += " WHERE trainingType = @type";
      reqSql.input("type", sql.VarChar(50), type);
    }
    query += " ORDER BY created_at DESC";

    const result = await reqSql.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error("READ error:", err);
    res.status(500).json({ error: err.message });
  }
});

/*─────────────────────────── 3)  UPDATE  ──────────────────────────────*/
router.put("/:guid", upload.single("image"), async (req, res) => {
  const { guid } = req.params;                      // keep as string
  const { trainingType, title, subTitle } = req.body;
  const imageFileName = req.file ? req.file.filename : null;

  try {
    /* 3.1  confirm row exists */
    const exists = await new sql.Request()
      .input("guid_id", sql.UniqueIdentifier, guid)
      .query("SELECT 1 FROM dbo.TrainingCarousel WHERE guid_id = @guid_id");
    if (exists.recordset.length === 0)
      return res.status(404).json({ error: "Item not found" });

    /* 3.2  dynamic update */
    let update = `
      UPDATE dbo.TrainingCarousel
      SET trainingType = @trainingType,
          title        = @title,
          subTitle     = @subTitle,
          updated_at   = GETDATE()
    `;
    if (imageFileName) update += ", image = @image";
    update += " WHERE guid_id = @guid_id";

    const reqSql = new sql.Request();
    reqSql.input("guid_id",      sql.UniqueIdentifier, guid);
    reqSql.input("trainingType", sql.VarChar(50),      trainingType);
    reqSql.input("title",        sql.VarChar(200),     title);
    reqSql.input("subTitle",     sql.VarChar(300),     subTitle);
    if (imageFileName)
      reqSql.input("image", sql.VarChar(300), imageFileName);

    await reqSql.query(update);
    res.json({ message: "Updated" });
  } catch (err) {
    console.error("UPDATE error:", err);
    res.status(500).json({ error: err.message });
  }
});

/*─────────────────────────── 4)  DELETE  ──────────────────────────────*/
router.delete("/:guid", async (req, res) => {
  const { guid } = req.params;

  try {
    const result = await new sql.Request()
      .input("guid_id", sql.UniqueIdentifier, guid)
      .query("DELETE FROM dbo.TrainingCarousel WHERE guid_id = @guid_id");

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ error: "Item not found" });

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("DELETE error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
