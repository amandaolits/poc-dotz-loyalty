const app = require("./app");
const env = require("./config/env");
const pool = require("./config/db");

async function start() {
  try {
    await pool.query("SELECT 1");
    console.log("Database connected");
    app.listen(env.port, () => console.log(`Server running on port ${env.port}`));
  } catch (err) {
    console.error("Failed to start:", err);
    process.exit(1);
  }
}

start();