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

export default pool;


