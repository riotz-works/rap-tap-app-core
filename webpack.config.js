const path = require('path');
const slsw = require('serverless-webpack');
const externals = require('webpack-node-externals');

const production = slsw.lib.options.stage === 'prd';


module.exports = {
  target: 'async-node',
  entry: slsw.lib.entries,
  mode: production ? 'production' : 'development',
  devtool: production ? '' : 'inline-source-map',
  externals: [ externals() ],
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader' }
    ]
  },
  resolve: {
    extensions: [ '.js', '.jsx', '.json', '.ts', '.tsx' ],
    alias: {
      '~': path.join(__dirname, '.')
    }
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js'
  }
};
