const path = require('path');
const webpack = require('webpack');
const sourcePath = path.join(__dirname, './src');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    tetris: ['./src/index.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(css|sass|scss)$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  mode: 'production',
  optimization: {
    splitChunks: false,
    minimizer: [new UglifyJsPlugin({
      uglifyOptions: {
        beautify: false,
        comments: false,
        compress: {
          sequences: true,
          booleans: true,
          loops: true,
          unused: true,
          warnings: false,
          drop_console: true
        }
      }
    })],
    noEmitOnErrors: true
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./vendorManifest.json')
    }),
    new webpack.DefinePlugin({
      'process.env': {
        production: true
      }
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
      sourcePath
    ]
  },
  output: {
    path: __dirname + '/res',
    filename: '[name].js',
    publicPath: '/'
  }
};
