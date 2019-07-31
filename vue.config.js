module.exports = {
  configureWebpack: {
    performance: {
      hints: false
    },
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000
      }
    },
    resolve: {
      alias: require("./aliases.config").webpack
    }
  },
  css: {
    // Enable CSS source maps.
    sourceMap: true
  },
  devServer: {
    host: "0.0.0.0",
    proxy: {
      "/uploads": {
        target: {
          host: "0.0.0.0",
          protocol: "http:",
          port: 3000
        },
        changeOrigin: true
      }
    }
  }
};
