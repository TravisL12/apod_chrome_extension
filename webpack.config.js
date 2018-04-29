const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const Uglify = require('uglifyjs-webpack-plugin');

const IndexHtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './client/index.html',
  filename: 'index.html',
  inject: 'body',
  chunks: ['index'], // only include index.js (see entry point)
});

const OptionsHtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './client/options.html',
  filename: 'options.html',
  chunks: ['options'], // only include options.js (see entry point)
});

// move files to dist folder
const CopyWebpackPluginConfig = new CopyWebpackPlugin([
  { from: './client/manifest.json' },
  { context: './client/images', from: '*', to: 'images' }, // copy images to dist folder
]);

module.exports = {
  entry: {
    index: './client/index.js',
    options: './client/scripts/options.js',
  },

  devtool: 'source-map',
  output: {
    path: path.resolve('dist'),
    filename: '[name].bundle.js',
  },
  resolve: {
    extensions: ['.js'],
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                sourceMap: false,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                minimize: true,
                sourceMap: false,
              },
            },
          ],
        }),
      },
    ],
  },
  plugins: [
    // new Uglify(),
    IndexHtmlWebpackPluginConfig,
    OptionsHtmlWebpackPluginConfig,
    CopyWebpackPluginConfig,
    new ExtractTextPlugin('styles/[name].css', {
      allChunks: false,
    }),
  ],
};
