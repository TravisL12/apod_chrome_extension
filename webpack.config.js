var webpack = require('webpack'),
  path = require('path'),
  fileSystem = require('fs-extra'),
  env = require('./utils/env'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  TerserPlugin = require('terser-webpack-plugin'),
  buildManifest = require('./utils/manifest');
var { CleanWebpackPlugin } = require('clean-webpack-plugin');

const ASSET_PATH = process.env.ASSET_PATH || '/';

// Chrome and Firefox build to separate directories so loading one unpacked
// does not clobber the other.
const TARGET = env.TARGET;
const BUILD_PATH = path.resolve(
  __dirname,
  TARGET === 'chrome' ? 'build' : `build-${TARGET}`
);

var alias = {
  'react-dom': '@hot-loader/react-dom',
};

// load the secrets
var secretsPath = path.join(__dirname, 'secrets.' + env.NODE_ENV + '.js');

var fileExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'eot',
  'otf',
  'svg',
  'ttf',
  'woff',
  'woff2',
  'webp',
];

if (fileSystem.existsSync(secretsPath)) {
  alias['secrets'] = secretsPath;
}

var options = {
  mode: process.env.NODE_ENV || 'development',
  // Only the pages the manifest actually references. The boilerplate's
  // options/content/devtools/panel entries were dead weight in the bundle.
  entry: {
    newtab: path.join(__dirname, 'src', 'pages', 'Newtab', 'index.tsx'),
    popup: path.join(__dirname, 'src', 'pages', 'Popup', 'index.jsx'),
    // Firefox's manifest drops the background key -- it has no MV3 service
    // worker -- so there is nothing for this bundle to be loaded by.
    ...(TARGET === 'chrome'
      ? {
          background: path.join(
            __dirname,
            'src',
            'pages',
            'Background',
            'index.js'
          ),
        }
      : {}),
  },
  chromeExtensionBoilerplate: {
    notHotReload: ['background'],
  },
  output: {
    filename: '[name].bundle.js',
    path: BUILD_PATH,
    clean: true,
    publicPath: ASSET_PATH,
  },
  module: {
    rules: [
      {
        // look for .css or .scss files
        test: /\.(css|scss)$/,
        // in the `src` directory
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
        type: 'asset/resource',
        exclude: /node_modules/,
        // loader: 'file-loader',
        // options: {
        //   name: '[name].[ext]',
        // },
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /node_modules/,
      },
      { test: /\.(ts|tsx)$/, loader: 'ts-loader', exclude: /node_modules/ },
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'source-map-loader',
          },
          {
            loader: 'babel-loader',
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: alias,
    extensions: fileExtensions
      .map((extension) => '.' + extension)
      .concat(['.js', '.jsx', '.ts', '.tsx', '.css']),
  },
  plugins: [
    new CleanWebpackPlugin({ verbose: false }),
    new webpack.ProgressPlugin(),
    // expose and write the allowed env vars on the compiled bundle
    // TARGET is read by the app itself: the top-sites favicon source differs
    // between the two browsers.
    new webpack.EnvironmentPlugin({ NODE_ENV: env.NODE_ENV, TARGET: TARGET }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/manifest.json',
          to: BUILD_PATH,
          force: true,
          transform: function (content) {
            // generates the manifest file using the package.json informations
            return Buffer.from(
              JSON.stringify(
                buildManifest(JSON.parse(content.toString()), TARGET)
              )
            );
          },
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        'icon-16.png',
        'icon-32.png',
        'icon-34.png',
        'icon-48.png',
        'icon-128.png',
      ].map((icon) => ({
        from: `src/assets/img/${icon}`,
        to: BUILD_PATH,
        force: true,
      })),
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'Newtab', 'index.html'),
      filename: 'newtab.html',
      chunks: ['newtab'],
      cache: false,
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'Popup', 'index.html'),
      filename: 'popup.html',
      chunks: ['popup'],
      cache: false,
    }),
  ],
  infrastructureLogging: {
    level: 'info',
  },
};

if (env.NODE_ENV === 'development') {
  options.devtool = 'cheap-module-source-map';
} else {
  options.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  };
}

module.exports = options;
