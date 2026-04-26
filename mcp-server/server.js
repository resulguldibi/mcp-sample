const express = require("express");
const { runSql } = require("./tools/runSql");
const { getSchema } = require("./tools/schema");

const app = express();
app.use(express.json());

app.post("/tools/run-sql", async (req, res) => {
  try {
    const data = await runSql(req.body.query);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/tools/schema", async (req, res) => {
  const data = await getSchema();
  res.json(data);
});

app.listen(3000, () => {
  console.log("MCP Server running on 3000");
});