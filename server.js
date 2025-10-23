const myArgs = process.argv.slice(2);

const path = require("path");

const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const webpack = require("webpack");
const webpackConfig = require(myArgs[0]);
const compiler = webpack(webpackConfig);

const express = require("express");
const app = express();

app
  .use(
    webpackDevMiddleware(compiler, {
      publicPath: "/dev",
    })
  )
  .use(
    webpackHotMiddleware(compiler, {
      publicPath: "/dev",
      path: "/__webpack_hmr",
      heartbeat: 10 * 1000,
      reload: true,
    })
  )
  .use(express.static(path.resolve(__dirname, "dev")))
  .get("*path", function (req, res) {
    res.sendFile(path.resolve(__dirname, "index.html"));
  });

const server = app.listen(3000, function () {
  const { address, port } = server.address();
  console.log(`Listening at ${address}:${port}`);
});
