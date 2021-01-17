const path = require('path');
const webpack = require('webpack');
const vendorModules = require('./vendorModules');

module.exports = {
  entry: {
    r16: vendorModules
  },
  resolve: {
		extensions: ['.js', '.jsx', '.json', '.less', '.css'],
		modules: [__dirname, 'node_modules']
	},
  mode: 'production',
  plugins: [
    new webpack.DllPlugin({
      name: '[name]',
      path: path.join(__dirname, 'vendorManifest.json')
    })
  ],
  output: {
    path: __dirname + '/res',
    filename: '[name].js',
    publicPath: '/',
    library: '[name]'
  }
};
