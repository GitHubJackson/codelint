// config/webpack.config.dev.js
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.common.js');
const path = require('path');

module.exports = merge(baseConfig, {
  mode: 'development',
  devServer: {
    port: 3000,
    host: 'localhost',
    compress: true,
    hot: true,
    open: true,
    historyApiFallback: true,
  },
  watchOptions: {
    ignored: /node_modules/,
  },
});
