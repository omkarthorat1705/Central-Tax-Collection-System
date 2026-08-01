const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = process.env.DB_PATH || path.resolve(__dirname, "../../database.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.log("Database Connection Error:", err.message);
  } else {
    console.log("SQLite Database Connected");
  }
});

module.exports = db;
