const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  category: String,
  description: String,
  date: Date,
});

module.exports = mongoose.model("Expense", ExpenseSchema);
