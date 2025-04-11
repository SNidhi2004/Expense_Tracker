const axios = require("axios");

async function parseExpense(text) {
  const prompt = `
Extract an expense from the sentence:
"${text}"
Return as JSON: amount, category, date, description
`;

  const response = await axios.post(
    process.env.AZURE_OPENAI_ENDPOINT,
    {
      messages: [
        { role: "system", content: "You are an expense parser." },
        { role: "user", content: prompt }
      ]
    },
    {
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.AZURE_OPENAI_API_KEY
      }
    }
  );

  const result = response.data.choices[0].message.content;
  return JSON.parse(result);
}

module.exports = { parseExpense };
