const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/public-renderer/client-renderer.tsx',
  output: {
    path: path.resolve(__dirname, 'dist/public-renderer'),
    filename: 'renderer.js',
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  // Bundle React directly to avoid CDN timing issues
  optimization: {
    minimize: true,
  },
};
