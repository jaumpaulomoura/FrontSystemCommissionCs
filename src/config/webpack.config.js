const path = require('path');

module.exports = {
  // Suas outras configurações do webpack...
  resolve: {
    fallback: {
      "fs": require.resolve("browserify-fs"),
      "path": require.resolve("path-browserify"),
      "http": require.resolve("stream-http")
    }
  }
};
