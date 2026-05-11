module.exports = {
  testEnvironment: "node",
  testTimeout: 15000,
  roots: ["<rootDir>/tests"],
  testMatch: ["**/*.test.js"],
  setupFiles: ["<rootDir>/tests/helpers/loadEnv.js"],
  globalSetup: "<rootDir>/tests/helpers/setup.js",
  verbose: true,
  collectCoverageFrom: ["src/**/*.js", "!src/server.js"],
  coverageDirectory: "coverage",
  maxWorkers: 1,
  forceExit: true,
};
