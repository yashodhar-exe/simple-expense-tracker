const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// Initialize Supabase client using the keys from your .env file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.post("/add-expense", async (req, res) => {
  const { text, amount, type, deviceId } = req.body;
  const numAmount = Number(amount);

  if (!text || isNaN(numAmount) || numAmount <= 0 || !type || !deviceId) {
    return res.status(400).json({ error: "Invalid or missing fields. Ensure amount is a positive number." });
  }

  // Insert standard row into the 'expenses' table
  const { data, error } = await supabase
    .from("expenses")
    .insert([
      { title: text, amount: numAmount, category: type, date: new Date().toISOString(), device_id: deviceId }
    ]);

  if (error) {
    console.error("SUPABASE ERROR:", error);
    return res.status(500).json({ error: "Insert failed" });
  }

  res.json({ message: "Expense added successfully" });
});

app.get("/expenses", async (req, res) => {
  const deviceId = req.query.deviceId;
  if (!deviceId) return res.status(400).json({ error: "Missing deviceId" });

  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("device_id", deviceId);

  if (error) {
    console.error("SUPABASE ERROR:", error);
    return res.status(500).json({ error: "Fetch failed" });
  }

  res.json(data);
});

app.delete("/expenses/:id", async (req, res) => {
  const { id } = req.params;
  const { deviceId } = req.query;

  if (!deviceId) return res.status(400).json({ error: "Missing deviceId" });

  const { data, error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id)
    .eq("device_id", deviceId);

  if (error) {
    console.error("SUPABASE ERROR:", error);
    return res.status(500).json({ error: "Delete failed" });
  }

  res.json({ message: "Expense deleted successfully" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;