const axios = require("axios");
const express = require("express");

const MCP_BASE = process.env.MCP_BASE || "http://host.docker.internal:3000";
const OLLAMA_BASE = process.env.OLLAMA_BASE || "http://host.docker.internal:11434";
const MODEL = process.env.LLM_MODEL || "codellama";
const PORT = Number(process.env.PORT || 4000);

async function getSchema() {
  const res = await axios.get(`${MCP_BASE}/tools/schema`);
  return res.data;
}

async function runSQL(query) {
  const res = await axios.post(`${MCP_BASE}/tools/run-sql`, { query });
  return res.data;
}

async function askLLM(prompt) {
  const res = await axios.post(`${OLLAMA_BASE}/api/generate`, {
    model: MODEL,
    prompt,
    stream: false,
  });

  return res.data.response;
}

async function generateSQL(question, schema) {
  const prompt = `
You are a PostgreSQL expert.

Schema:
${JSON.stringify(schema)}

Task:
Convert the following question into SQL. Return only sql, no explanations.

Rules:
- Only SELECT
- Always use LIMIT 10
- Use correct joins

Question:
${question}

SQL:
`;

  return askLLM(prompt);
}

async function explainResult(question, result) {
  const prompt = `
User question:
${question}

Query result:
${JSON.stringify(result)}

Explain the result in simple terms.
`;

  return askLLM(prompt);
}

async function runAgent(question) {
  const schema = await getSchema();
  const sql = await generateSQL(question, schema);
  const result = await runSQL(sql);
  const explanation = await explainResult(question, result);

  return {
    question,
    sql,
    result,
    explanation,
  };
}

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body || {};

    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "question (string) is required" });
    }

    const response = await runAgent(question.trim());
    return res.json(response);
  } catch (error) {
    const details = error.response?.data || error.message;
    return res.status(500).json({ error: "agent_failed", details });
  }
});

app.listen(PORT, () => {
  console.log(`ai-client api listening on port ${PORT}`);
});