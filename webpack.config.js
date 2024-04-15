/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const DotenvWebpackPlugin = require('dotenv-webpack');

const path = require('path');
const dotenv = require('dotenv');

const HtmlWebpackPlugin = require('html-webpack-plugin');

dotenv.config();

module.exports = {
  entry: './src/app.tsx',
  devServer: {
    port: 8080,
    historyApiFallback: true,
    client: {
      overlay: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /.scss$/,
        use: ['style-loader',
          'css-loader',
          'sass-loader'],

      },
      {
        test: /\.css$/,
        use: ['style-loader',
          'css-loader'],
      },
    ],
  },
  plugins: [
    new DotenvWebpackPlugin({ systemvars: true }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      favicon: './images/favicon.ico',
      // 'process.env': JSON.stringify(process.env),
    }),
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@blockchain': path.resolve(__dirname, 'src/blockchain'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@global': path.resolve(__dirname, 'src/global'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
  },
  mode: 'development',
};
