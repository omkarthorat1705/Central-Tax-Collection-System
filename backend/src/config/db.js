const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const databasePath = path.join(__dirname, "../../database.db");

console.log("Using database:", databasePath);

const db = new sqlite3.Database(databasePath, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("SQLite Database Connected");
  }
});

module.exports = db;
