const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

const IndexHtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: "./client/apod-by-trav.html",
  filename: "apod-by-trav.html",
  inject: "body",
  chunks: ["index"] // only include index.js (see entry point)
});

const OptionsHtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: "./client/options.html",
  filename: "options.html",
  chunks: ["options"] // only include options.js (see entry point)
});

// move files to dist folder
const CopyWebpackPluginConfig = new CopyWebpackPlugin([
  { from: "./client/manifest.json" },
  { context: "./client/images", from: "*", to: "images" } // copy images to dist folder
]);

module.exports = {
  entry: {
    index: "./client/index.js",
    options: "./client/scripts/options.js"
  },

  devtool: "source-map",
  output: {
    path: path.resolve("dist"),
    filename: "[name].bundle.js"
  },
  resolve: {
    alias: {
      scripts: path.resolve(__dirname, "client/scripts/"),
      styles: path.resolve(__dirname, "client/styles/")
    },
    extensions: [".js"],
    mainFiles: ["index"]
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      }
    ],
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              options: {
                minimize: true,
                sourceMap: false
              }
            },
            {
              loader: "sass-loader",
              options: {
                minimize: true,
                sourceMap: false
              }
            }
          ]
        })
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(["dist"]),
    IndexHtmlWebpackPluginConfig,
    OptionsHtmlWebpackPluginConfig,
    CopyWebpackPluginConfig,
    new ExtractTextPlugin("styles/[name].css", {
      allChunks: false
    }),
    new WorkboxPlugin.GenerateSW({
      // Exclude images from the precache
      exclude: [/\.(?:png|jpg|jpeg|svg)$/],

      // Define runtime caching rules.
      runtimeCaching: [
        {
          // Match any request ends with .png, .jpg, .jpeg or .svg.
          urlPattern: /\.(?:png|jpg|jpeg|svg)$/,

          // Apply a cache-first strategy.
          handler: "CacheFirst",

          options: {
            // Use a custom cache name.
            cacheName: "images",

            // Only cache 10 images.
            expiration: {
              maxEntries: 10
            }
          }
        }
      ]
    })
  ]
};
