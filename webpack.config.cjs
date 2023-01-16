const path = require("path");
// webpack needs to be explicitly required
const webpack = require("webpack");

module.exports = {
  stats: { errorDetails: true },
  target: "webworker",
  output: {
    path: path.join(process.cwd(), "bin"),
    filename: "index.js",
  },
  // mode: 'production',
  mode: "production",
  devtool: "cheap-module-source-map",
  optimization: {
    sideEffects: true,
    minimize: true
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json"],
    mainFields: ['browser', 'module', 'main'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: "/node_modules/",
      }
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
  ],
  externals: [
    ({request,}, callback) => {
      // Allow Webpack to handle fastly:* namespaced module imports by treating
      // them as modules rather than try to process them as URLs
      if (/^fastly:.*$/.test(request)) {
        return callback(null, 'commonjs ' + request);
      }
      callback();
    }
  ],
};