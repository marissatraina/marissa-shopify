const webpack = require('webpack');

const nodeEnv = process.env.NODE_ENV || 'production';


module.exports = {
  devtool: 'source-map',
  entry: {
    filename: './app.js'
  },
  output: {
    filename: '../assets/theme.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [
            ['es2015', { 'modules': false }]
          ]
        }
      },
      {
        test: /scripts\/modernizr\.js$/,
        loader: 'imports-loader?this=>window!exports-loader?window.Modernizr'
      }
    ]
  },
  plugins: [
    // uglify js
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      output: { comments: false },
      sourceMap: false
    }),
    // env plugin
    new webpack.DefinePlugin({
      'proccess.env': { NODE_ENV: JSON.stringify(nodeEnv) }
    })
  ]
};
