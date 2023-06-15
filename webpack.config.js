const fs = require("fs");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpackMerge = require("webpack-merge");
const baseConfig = require("@splunk/webpack-configs/base.config").default;

// Set up an entry config by iterating over the files in the pages directory.
const entries = fs
  .readdirSync(path.join(__dirname, "pages"))
  .filter((pageFile) => !/^\./.test(pageFile))
  .reduce((accum, page) => {
    accum[page] = path.join(__dirname, "pages", page);
    return accum;
  }, {});

module.exports = webpackMerge(baseConfig, {
  entry: entries,
  output: {
    path: path.join(__dirname, "stage/appserver/static/pages/"),
    filename: "[name].js",
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, "splunk"),
        to: path.join(__dirname, "stage"),
      },
    ]),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  devtool: "eval-source-map",
});
