const express = require('express');
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const webpack = require('webpack');
const webpackConfig = require('./webpack.dev.config.js');
const path = require('path');
const app = express();

const compiler = webpack(webpackConfig);

app.use(webpackDevMiddleware(compiler, {
  hot: true,
  filename: 'bundle.js',
  publicPath: "/res",
  stats: {
    colors: true,
  },
  historyApiFallback: true,
}));

app.use(webpackHotMiddleware(compiler, {
  log: console.log,
  path: '/__webpack_hmr',
  heartbeat: 10 * 1000,
}));

app.use(express.static(__dirname + "/res"));

app.get('*', function (req, res)
{
  res.sendFile(path.resolve(__dirname, 'index.html'))
});

const server = app.listen(3000, function ()
{
  const host = server.address().address;
  const port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
