require("dotenv").config();

const env = {
  port: parseInt(process.env.PORT, 10) || 3000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
};

const required = ["databaseUrl", "jwtSecret"];
const missing = required.filter((key) => !env[key]);
if (missing.length > 0) {
  throw new Error(`Missing required env vars: ${missing.join(", ")}`);
}

module.exports = env;
