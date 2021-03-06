const webpack = require(`webpack`);
const CopyWebpackPlugin = require(`copy-webpack-plugin`);
const MiniCssExtractPlugin = require(`mini-css-extract-plugin`);
const AssetsPlugin = require(`assets-webpack-plugin`);
const Fiber = require(`fibers`); // Improves (Dart) SASS processing speed

const config = require(`./config.js`);

module.exports = {
  entry: {
    main: config.paths.entry.main,
  },

  output: {
    path: config.paths.output,
  },

  module: {
    rules: [
      {
        test: /\.((png)|(eot)|(woff)|(woff2)|(ttf)|(svg)|(gif))(\?v=\d+\.\d+\.\d+)?$/,
        loader: `file-loader?name=/[hash].[ext]`,
      },

      {test: /\.json$/, loader: `json-loader`},

      {
        loader: `babel-loader`,
        test: /\.js?$/,
        exclude: /node_modules/,
        query: {cacheDirectory: true},
      },

      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: [
          `style-loader`,
          MiniCssExtractPlugin.loader,
          `css-loader`,
          `postcss-loader`,
          {
            loader: `sass-loader`,
            options: {
              sourceComments: true,
              includePaths: [`${config.paths.assets}/styles`],
              implementation: require(`sass`),
              fiber: Fiber,
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new webpack.ProvidePlugin({
      fetch: `imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch`,
    }),

    new AssetsPlugin({
      filename: `webpack.json`,
      path: config.paths.assets,
      prettyPrint: true,
    }),

    new CopyWebpackPlugin([
      {
        from: `./src/fonts/`,
        to: `fonts/`,
        flatten: true,
      },
    ]),
  ],
};
