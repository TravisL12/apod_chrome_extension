const merge = require('webpack-merge');
const common = require('./webpack.base.js');
const Uglify = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
  devtool: 'none',
  plugins: [
    new Uglify(),
  ],
});
