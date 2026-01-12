import express from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;

const user = process.env.USER;
const host = process.env.HOST;
const db = process.env.db;
const password = process.env.PASSWORD;
const port = process.env.port;

const pool = new Pool({
  user: user,
  host: host,
  database: db,
  password: password,
  port: port,
});

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/activities", async (req, res) => {
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

app.get("/api/activities", async (res) => {
  const result = await pool.query(
    `SELECT * FROM activity`
  )
  res.status(201).json(result.rows);
})

app.listen(3000, () => console.log("Server running on port 3000"));

