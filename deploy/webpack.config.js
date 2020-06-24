/* eslint-disable @typescript-eslint/camelcase */        // 'cuz key name of configuration is specified
/* eslint-disable @typescript-eslint/no-var-requires */  // 'cuz of the JavaScript file
const path = require('path');
const slsw = require('serverless-webpack');
const TerserPlugin = require('terser-webpack-plugin');
const externals = require('webpack-node-externals');

const production = slsw.lib.options.stage === 'prd';
const entries = production ? slsw.lib.entries : [ ...new Map(Object.entries(slsw.lib.entries)) ].reduce((l, [ k, v ]) => Object.assign(l, { [k]: [ './deploy/source-map-install.js', v ]}), {});


module.exports = {
  mode: production ? 'production' : 'development',
  target: 'async-node',
  entry: entries,
  devtool: production ? '' : 'inline-source-map',
  externals: [
    externals({
      modulesFromFile: {
        include: [ 'dependencies', ...production ? [] : [ 'source-map-support' ] ]
      }
    })
  ],
  resolve: {
    extensions: [ '.js', '.jsx', '.json', '.ts', '.tsx' ],
    alias: {
      '~': path.join(__dirname, '../src')
    }
  },
  module: {
    rules: [
      { test: /\.tsx?$/u, use: 'ts-loader' }
    ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: production
          }
        }
      })
    ]
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js'
  }
};
