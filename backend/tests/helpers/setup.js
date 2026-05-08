require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env.test") });
const { execSync } = require("child_process");
const path = require("path");
const { Pool } = require("pg");
let pool;

async function ensureTestDb() {
  const adminPool = new Pool({
    connectionString: process.env.DATABASE_URL.replace("/dotz_loyalty_test", "/postgres"),
  });
  try {
    await adminPool.query("CREATE DATABASE dotz_loyalty_test");
  } catch (e) {
    if (!e.message.includes("already exists")) throw e;
  }
  await adminPool.end();
}

async function runMigrations() {
  const migratePath = path.resolve(__dirname, "../../node_modules/.bin/node-pg-migrate");
  execSync(
    `node "${migratePath}" up --migration-file-language js --migrations-dir="${path.resolve(__dirname, "../../migrations")}"`,
    {
      cwd: path.resolve(__dirname, "../.."),
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
      stdio: "pipe",
    }
  );
}

async function truncateTables() {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const result = await pool.query(
    "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename != 'migrations'"
  );
  for (const row of result.rows) {
    await pool.query(`TRUNCATE TABLE "${row.tablename}" CASCADE`);
  }
  await pool.end();
}

module.exports = async () => {
  await ensureTestDb();
  await runMigrations();
  await truncateTables();
};
