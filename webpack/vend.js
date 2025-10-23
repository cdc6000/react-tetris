const path = require("path");
const webpack = require("webpack");
const vendorModules = require("../vendor/vendorModules");

module.exports = {
  mode: "production",
  entry: {
    r19: vendorModules,
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".less", ".css"],
    modules: [__dirname, "node_modules"],
  },
  plugins: [
    new webpack.DllPlugin({
      name: "[name]",
      path: path.join(__dirname, "..", "vendor", "vendorManifest.json"),
    }),
  ],
  output: {
    path: path.join(__dirname, "..", "rel"),
    filename: "[name].js",
    publicPath: "/",
    library: "[name]",
  },
};
