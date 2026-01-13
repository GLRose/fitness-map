import express from "express";
import pool from "../db.js";

const router = express.Router();

router.post("/api/activities", async (req, res) => {
  const { activity, date } = req.body;

  if (typeof activity !== "boolean" || !date) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO activity (activity, date)
       VALUES ($1, $2)
       RETURNING id, activity, date`,
      [activity, date]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

router.get("/api/activities", async (_req, res) => {
  const result = await pool.query(
    `SELECT * FROM activity`
  )
  res.status(201).json(result.rows);
})


export default router;
