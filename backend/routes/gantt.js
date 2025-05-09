// BACKEND FILE: routes/gantt.js

import express from "express";
import sql from "mssql";

const router = express.Router();

/*───────────────────────────  Helper Functions  ───────────────────────────*/
// Convert date to SQL format
const toSqlDate = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date;
};

// Format date for front-end
const formatDate = (sqlDate) => {
  if (!sqlDate) return null;
  return sqlDate.toISOString();
};

// Convert task from database to Gantt format
const mapTaskFromDB = (task) => {
  return {
    id: task.id,
    text: task.text,
    start: formatDate(task.start_date),
    duration: task.duration || 1,
    progress: task.progress || 0,
    parent: task.parent_id || 0,
    type: task.task_type || "task",
    open: Boolean(task.is_open)
  };
};

// Convert link from database to Gantt format
const mapLinkFromDB = (link) => {
  return {
    id: link.id,
    source: link.source_id,
    target: link.target_id,
    type: link.link_type || "0"
  };
};

/*───────────────────────────  GET Data  ───────────────────────────*/
// Get all tasks and links for the Gantt chart
router.get("/", async (req, res) => {
  try {
    // Get tasks
    const tasksResult = await new sql.Request().query(`
      SELECT 
        id, 
        text, 
        start_date, 
        duration, 
        progress, 
        parent_id, 
        task_type,
        is_open
      FROM 
        dbo.GanttTasks
      ORDER BY 
        id
    `);
    
    // Get links
    const linksResult = await new sql.Request().query(`
      SELECT 
        id, 
        source_id, 
        target_id, 
        link_type
      FROM 
        dbo.GanttLinks
    `);
    
    // Map database results to Gantt format
    const tasks = tasksResult.recordset.map(mapTaskFromDB);
    const links = linksResult.recordset.map(mapLinkFromDB);
    
    // Set content type explicitly
    res.setHeader('Content-Type', 'application/json');
    res.json({ tasks, links });
  } catch (err) {
    console.error("Error fetching Gantt data:", err);
    res.status(500).json({ error: err.message });
  }
});

/*───────────────────────────  ADD Task  ───────────────────────────*/
router.post("/task", async (req, res) => {
  try {
    const { text, start, duration, progress, parent, type, open } = req.body;
    
    // Convert date to SQL format
    const startDate = toSqlDate(start) || new Date();
    
    const result = await new sql.Request()
      .input("text", sql.NVarChar(200), text || "New Task")
      .input("start_date", sql.DateTime, startDate)
      .input("duration", sql.Int, duration || 1)
      .input("progress", sql.Float, progress || 0)
      .input("parent_id", sql.Int, parent || 0)
      .input("task_type", sql.NVarChar(50), type || "task")
      .input("is_open", sql.Bit, open === undefined ? 1 : open ? 1 : 0)
      .query(`
        INSERT INTO dbo.GanttTasks 
          (text, start_date, duration, progress, parent_id, task_type, is_open)
        VALUES 
          (@text, @start_date, @duration, @progress, @parent_id, @task_type, @is_open);
        
        SELECT SCOPE_IDENTITY() AS id;
      `);
    
    const id = result.recordset[0].id;
    
    res.status(201).json({
      action: "inserted",
      tid: id
    });
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ error: err.message });
  }
});

/*───────────────────────────  UPDATE Task  ───────────────────────────*/
router.put("/task/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { text, start, duration, progress, parent, type, open } = req.body;
    
    // Verify task exists
    const taskExists = await new sql.Request()
      .input("id", sql.Int, id)
      .query("SELECT 1 FROM dbo.GanttTasks WHERE id = @id");
      
    if (taskExists.recordset.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    
    // Build update query dynamically based on provided fields
    let updateQuery = "UPDATE dbo.GanttTasks SET ";
    const updateFields = [];
    const request = new sql.Request();
    
    if (text !== undefined) {
      updateFields.push("text = @text");
      request.input("text", sql.NVarChar(200), text);
    }
    
    if (start !== undefined) {
      updateFields.push("start_date = @start_date");
      request.input("start_date", sql.DateTime, toSqlDate(start));
    }
    
    if (duration !== undefined) {
      updateFields.push("duration = @duration");
      request.input("duration", sql.Int, duration);
    }
    
    if (progress !== undefined) {
      updateFields.push("progress = @progress");
      request.input("progress", sql.Float, progress);
    }
    
    if (parent !== undefined) {
      updateFields.push("parent_id = @parent_id");
      request.input("parent_id", sql.Int, parent === 0 ? null : parent);
    }
    
    if (type !== undefined) {
      updateFields.push("task_type = @task_type");
      request.input("task_type", sql.NVarChar(50), type);
    }
    
    if (open !== undefined) {
      updateFields.push("is_open = @is_open");
      request.input("is_open", sql.Bit, open ? 1 : 0);
    }
    
    // Add updated_at timestamp
    updateFields.push("updated_at = GETDATE()");
    
    // If no fields to update, return success
    if (updateFields.length === 0) {
      return res.json({ action: "updated", tid: id });
    }
    
    updateQuery += updateFields.join(", ");
    updateQuery += " WHERE id = @id";
    
    request.input("id", sql.Int, id);
    await request.query(updateQuery);
    
    res.json({ action: "updated", tid: id });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: err.message });
  }
});

/*───────────────────────────  DELETE Task  ───────────────────────────*/
router.delete("/task/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // First delete all child tasks recursively
    await deleteChildTasks(id);
    
    // Then delete the main task
    const result = await new sql.Request()
      .input("id", sql.Int, id)
      .query("DELETE FROM dbo.GanttTasks WHERE id = @id");
      
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    
    res.json({ action: "deleted" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: err.message });
  }
});

// Helper function to recursively delete child tasks
async function deleteChildTasks(parentId) {
  // Get all children
  const childrenResult = await new sql.Request()
    .input("parent_id", sql.Int, parentId)
    .query("SELECT id FROM dbo.GanttTasks WHERE parent_id = @parent_id");
    
  // Recursively delete each child and its children
  for (const child of childrenResult.recordset) {
    await deleteChildTasks(child.id);
  }
  
  // Delete all children
  await new sql.Request()
    .input("parent_id", sql.Int, parentId)
    .query("DELETE FROM dbo.GanttTasks WHERE parent_id = @parent_id");
}

/*───────────────────────────  ADD Link  ───────────────────────────*/
router.post("/link", async (req, res) => {
  try {
    const { source, target, type } = req.body;
    
    const result = await new sql.Request()
      .input("source_id", sql.Int, source)
      .input("target_id", sql.Int, target)
      .input("link_type", sql.NVarChar(50), type || "0")
      .query(`
        INSERT INTO dbo.GanttLinks 
          (source_id, target_id, link_type)
        VALUES 
          (@source_id, @target_id, @link_type);
        
        SELECT SCOPE_IDENTITY() AS id;
      `);
    
    const id = result.recordset[0].id;
    
    res.status(201).json({
      action: "inserted",
      tid: id
    });
  } catch (err) {
    console.error("Error adding link:", err);
    res.status(500).json({ error: err.message });
  }
});

/*───────────────────────────  UPDATE Link  ───────────────────────────*/
router.put("/link/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { source, target, type } = req.body;
    
    // Verify link exists
    const linkExists = await new sql.Request()
      .input("id", sql.Int, id)
      .query("SELECT 1 FROM dbo.GanttLinks WHERE id = @id");
      
    if (linkExists.recordset.length === 0) {
      return res.status(404).json({ error: "Link not found" });
    }
    
    // Build update query dynamically based on provided fields
    let updateQuery = "UPDATE dbo.GanttLinks SET ";
    const updateFields = [];
    const request = new sql.Request();
    
    if (source !== undefined) {
      updateFields.push("source_id = @source_id");
      request.input("source_id", sql.Int, source);
    }
    
    if (target !== undefined) {
      updateFields.push("target_id = @target_id");
      request.input("target_id", sql.Int, target);
    }
    
    if (type !== undefined) {
      updateFields.push("link_type = @link_type");
      request.input("link_type", sql.NVarChar(50), type);
    }
    
    // If no fields to update, return success
    if (updateFields.length === 0) {
      return res.json({ action: "updated", tid: id });
    }
    
    updateQuery += updateFields.join(", ");
    updateQuery += " WHERE id = @id";
    
    request.input("id", sql.Int, id);
    await request.query(updateQuery);
    
    res.json({ action: "updated", tid: id });
  } catch (err) {
    console.error("Error updating link:", err);
    res.status(500).json({ error: err.message });
  }
});

/*───────────────────────────  DELETE Link  ───────────────────────────*/
router.delete("/link/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await new sql.Request()
      .input("id", sql.Int, id)
      .query("DELETE FROM dbo.GanttLinks WHERE id = @id");
      
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Link not found" });
    }
    
    res.json({ action: "deleted" });
  } catch (err) {
    console.error("Error deleting link:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;