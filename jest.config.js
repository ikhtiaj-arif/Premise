// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!simple-keyboard-layouts)", // 👈 Force-transform this package
  ],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  // Inside config/jest/config.js or similar
  transformIgnorePatterns: ["node_modules/(?!simple-keyboard-layouts)"],
};
