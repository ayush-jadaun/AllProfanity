export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        isolatedModules: true,
        tsconfig: {
          module: "ESNext",
          moduleResolution: "node",
          esModuleInterop: true,
        },
      },
    ],
  },
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts"],
  transformIgnorePatterns: ["node_modules/(?!.*\\.mjs$)"],
};
