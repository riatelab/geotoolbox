module.exports = {
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest",
    },
    setupFilesAfterEnv: ["./testing/setup.js"],
    transformIgnorePatterns: [                                                                            
      '/node_modules/(?!d3-(geo|array)|internmap)',                                                      
    ]
};