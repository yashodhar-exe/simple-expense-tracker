const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "expense_tracker"
});

db.connect(err => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("MySQL Connected");
});

app.post("/add-expense", (req, res) => {
  console.log("REQ BODY:", req.body);  

  const { text, amount, type } = req.body;

  if (!text || !amount || !type) {
    console.log("VALIDATION FAILED");
    return res.status(400).json({ error: "Missing fields" });
  }

  const sql =
    "INSERT INTO expenses (title, amount, category, date) VALUES (?, ?, ?, CURDATE())";

  db.query(sql, [text, Number(amount), type], (err, result) => {
    if (err) {
      console.error("MYSQL ERROR:", err);  
      return res.status(500).json({ error: "Insert failed" });
    }

    console.log("INSERT RESULT:", result); 
    res.json({ message: "Expense added successfully" });
  });
});

app.get("/expenses", (req, res) => {
  db.query("SELECT * FROM expenses", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Fetch failed" });
    }
    res.json(results);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});