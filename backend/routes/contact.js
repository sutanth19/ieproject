// C:\Users\4108231\Desktop\project_ie\backend\routes\contact.js
import express from "express";
import sql from "mssql";

const router = express.Router();

/**
 * POST: Save a new contact message.
 * Inserts messages with status 0 (which is stored as BIT and will be returned as false).
 */
router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;
  
  try {
    const request = new sql.Request();
    await request
      .input("name", sql.VarChar(100), name)
      .input("email", sql.VarChar(100), email)
      .input("subject", sql.VarChar(200), subject)
      .input("message", sql.Text, message)
      .query(`
        INSERT INTO [dbo].[ContactMessages] 
          (name, email, subject, message, created_at, status)
        VALUES 
          (@name, @email, @subject, @message, GETDATE(), 0)
      `);
    res.status(201).json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error("POST /api/contact error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET: Retrieve all contact messages.
 */
router.get("/", async (req, res) => {
  try {
    const request = new sql.Request();
    const result = await request.query(`
      SELECT * FROM [dbo].[ContactMessages] 
      ORDER BY created_at DESC
    `);
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("GET /api/contact error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT: Update a message's status to read.
 * The frontend sends { status: 1 }.
 * Note: Since the database field is BIT, 1 will be returned as true.
 */
router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Expecting { status: 1 }
  
  try {
    const messageId = parseInt(id, 10);
    if (isNaN(messageId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    
    // Check if the message exists.
    const checkRequest = new sql.Request();
    const checkResult = await checkRequest
      .input("id", sql.Int, messageId)
      .query(`SELECT TOP 1 * FROM [dbo].[ContactMessages] WHERE id = @id`);
    
    if (checkResult.recordset.length === 0) {
      return res
        .status(404)
        .json({ error: `Message not found with ID: ${messageId}` });
    }
    
    // Update status to read.
    const updateRequest = new sql.Request();
    await updateRequest
      .input("id", sql.Int, messageId)
      .input("status", sql.Bit, status)
      .query(`
        UPDATE [dbo].[ContactMessages] 
        SET status = @status 
        WHERE id = @id
      `);
    
    res.status(200).json({ message: "Message status updated successfully" });
  } catch (err) {
    console.error(`PUT /api/contact/${id}/status error:`, err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE: Remove a contact message by ID.
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    const messageId = parseInt(id, 10);
    if (isNaN(messageId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    
    // Check if the message exists.
    const checkRequest = new sql.Request();
    const checkResult = await checkRequest
      .input("id", sql.Int, messageId)
      .query(`SELECT TOP 1 * FROM [dbo].[ContactMessages] WHERE id = @id`);
    
    if (checkResult.recordset.length === 0) {
      return res
        .status(404)
        .json({ error: `Message not found with ID: ${messageId}` });
    }
    
    // Delete the message.
    const deleteRequest = new sql.Request();
    await deleteRequest
      .input("id", sql.Int, messageId)
      .query(`DELETE FROM [dbo].[ContactMessages] WHERE id = @id`);
    
    res.status(200).json({ message: `Message with ID ${messageId} deleted successfully` });
  } catch (err) {
    console.error(`DELETE /api/contact/${id} error:`, err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
