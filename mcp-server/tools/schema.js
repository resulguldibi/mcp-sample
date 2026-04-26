const db = require("../db");

async function getSchema() {
  const query = `
    SELECT table_name, column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
  `;

  const result = await db.query(query);
  return result.rows;
}

module.exports = { getSchema };