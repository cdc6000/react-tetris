const { merge } = require("webpack-merge");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const base = require("./base.js");

const path = require("path");
const vendorManifest = require("../vendor/vendorManifest.json");

// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = merge(base, {
  mode: "production",
  entry: {
    tetris: [path.join(__dirname, "..", "src", "index.jsx")],
  },
  optimization: {
    splitChunks: false,
    // minimize: false,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: 6,
          compress: {
            // pure_funcs: ['console.log'],
            ecma: 6,
            passes: 2,
            unsafe_math: true,
          },
        },
        extractComments: {
          filename: "LICENSE.txt",
          condition: true,
          banner: false,
        },
      }),
    ],
    noEmitOnErrors: true,
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: vendorManifest,
    }),
    new webpack.DefinePlugin({
      "process.env.npm_package_name": JSON.stringify(process.env.npm_package_name),
      "process.env.npm_package_version": JSON.stringify(process.env.npm_package_version),
      "process.env.production": true,
    }),
    // new BundleAnalyzerPlugin(),
  ],
  output: {
    path: path.join(__dirname, "..", "electron_build", "build"),
    filename: "[name].js",
  },
});
