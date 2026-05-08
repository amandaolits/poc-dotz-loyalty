const { createCjsPreset } = require("jest-preset-angular/presets");

module.exports = {
  ...createCjsPreset({ tsconfig: "<rootDir>/tsconfig.json" }),
  setupFilesAfterEnv: ["<rootDir>/jasmine-shim.js", "<rootDir>/setup-jest.ts"],
  testMatch: ["<rootDir>/src/**/*.spec.ts"],
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: [
    "src/app/**/*.ts",
    "!src/app/**/*.module.ts",
    "!src/main.ts",
  ],
  coverageDirectory: "coverage",
};
