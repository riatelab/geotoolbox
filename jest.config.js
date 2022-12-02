module.exports = {
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest",
    },
    setupFilesAfterEnv: ["./testing/setup.js"]
};