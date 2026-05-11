require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env.test") });
const path = require("path");
const { Pool } = require("pg");
const { runner } = require("node-pg-migrate");
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
  await runner({
    databaseUrl: process.env.DATABASE_URL,
    dir: path.resolve(__dirname, "../../migrations"),
    direction: "up",
    migrationsTable: "migrations",
    count: Infinity,
    fileLanguage: "js",
    noLock: true,
  });
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
