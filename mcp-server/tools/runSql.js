const db = require("../db");
const { validateQuery } = require("../utils/security");

async function runSql(query) {
  validateQuery(query);

  const result = await db.query(query);
  return result.rows;
}

module.exports = { runSql };