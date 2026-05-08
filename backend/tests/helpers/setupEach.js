const pool = require("../../src/config/db");

beforeAll(async () => {
  const result = await pool.query(
    "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename != 'migrations'"
  );
  for (const row of result.rows) {
    await pool.query(`TRUNCATE TABLE "${row.tablename}" CASCADE`);
  }
});

afterAll(async () => {
  await pool.end();
});
