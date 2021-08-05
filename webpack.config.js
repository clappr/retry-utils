const path = require('path')
const TerserPlugin = require("terser-webpack-plugin")
const NPM_RUN = process.env.npm_lifecycle_event

/**
 * Development config
 */
const customConfig = {
  mode: 'development',
  filename: 'retry-utils.dev.js',
  optimization: {
    minimize: false,
  }
}

/**
 * Release config
 */
if (NPM_RUN === 'release') {
  customConfig.mode = 'production'
  customConfig.filename = 'retry-utils.js'
  customConfig.optimization = {
    minimize: true,
    minimizer: [new TerserPlugin({
      include: /\/*.js/,
    })],
  }
}

const webpackConfig = {
  mode: customConfig.mode,
  entry: path.resolve(__dirname, 'lib/retry.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'dist/',
    library: {
      type: 'module'
    },
    filename: customConfig.filename,
    clean: true,
  },
  experiments: {
    outputModule: true,
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
  },
  optimization: customConfig.optimization,
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}

module.exports = webpackConfig