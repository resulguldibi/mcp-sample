function validateQuery(query) {
  const normalized = String(query || "").trim();
  const lower = normalized.toLowerCase();

  if (!normalized) {
    throw new Error("Query is required");
  }

  // Allow formatted SQL with leading spaces/newlines.
  if (!lower.startsWith("select")) {
    throw new Error("Only SELECT queries allowed");
  }

  if (!lower.includes("limit")) {
    throw new Error("Query must include LIMIT");
  }

  return true;
}

module.exports = { validateQuery };