const express = require("express");
const Expense = require("../models/Expense");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const expenses = await Expense.find({ userId: req.userId }).sort({ date: -1 });
  res.json(expenses);
});

router.post("/", auth, async (req, res) => {
  const { amount, category, description, date } = req.body;
  const expense = await Expense.create({ userId: req.userId, amount, category, description, date });
  res.json(expense);
});

module.exports = router;
