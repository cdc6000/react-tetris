const webpack = require('webpack');
const path = require('path');
const sourcePath = path.join(__dirname, '../src');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        resolve: {
          extensions: ['.js', '.jsx'],
        },
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(css|sass|scss)$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              url: false
            },
          },
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass"),
              additionalData: '$projPrefix: react-tetris;',
            },
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        loader: 'url-loader',
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        loader: 'file-loader',
        options: {
          esModule: false,
          outputPath: '../fonts',
          publicPath: './fonts/',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [path.resolve(__dirname, '../node_modules'), sourcePath],
    alias: {
      '@assets': path.resolve(__dirname, `${sourcePath}/assets`),
      '@packages': path.resolve(__dirname, `${sourcePath}/packages`),
      '@components': path.resolve(__dirname, `${sourcePath}/components`),
      '@api': path.resolve(__dirname, `${sourcePath}/API`),
      '@constants': path.resolve(__dirname, `${sourcePath}/constants`),
      '@utils': path.resolve(__dirname, `${sourcePath}/utils`),
      '@stores': path.resolve(__dirname, `${sourcePath}/stores`),
      '@': path.resolve(__dirname, `${sourcePath}`),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.projPrefix": '"react-tetris"',
    }),
  ],
  output: {
    path: path.join(__dirname, '..', 'dev'),
    filename: '[name].js',
    publicPath: '/dev',
  },
};
