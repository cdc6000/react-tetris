const { merge } = require('webpack-merge');
const webpack = require('webpack');
const dev = require('./dev.js');

module.exports = merge(dev, {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.apiOrigin': '"http://127.0.0.1:3000"',
    }),
  ],
});
