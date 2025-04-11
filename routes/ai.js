const express = require("express");
const auth = require("../middleware/auth");
const aiService = require("../aiService");

const router = express.Router();

router.post("/parse", auth, async (req, res) => {
  const result = await aiService.parseExpense(req.body.text);
  if (result) res.json(result);
  else res.status(500).json({ error: "AI failed to parse." });
});

module.exports = router;
