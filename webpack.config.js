const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const dist = path.resolve(__dirname, 'dist');

module.exports = {
  mode: 'production',
  entry: {
    'background': './background.js',
    'speed-bump': './speed-bump.jsx',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: './icon-*.png',
          to: dist,
        },
        {
          from: './manifest.json',
          to: dist,
        },
        {
          from: './speed-bump.html',
          to: dist,
        },
      ],
    }),
  ],
  output: {
    path: dist,
    filename: '[name].bundle.js',
    clean: true,
  },
};
