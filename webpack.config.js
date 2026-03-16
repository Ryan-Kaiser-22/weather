const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  //Sets the environment to development for faster builds and better debugging
  mode: 'development',
  devtool: 'inline-source-map',
  
  //The starting point
  entry: './src/index.js',

  //Where the final bundle goes
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Cleans the /dist folder before each build
  },

  //Development Server settings (live-reloading)
  devServer: {
    static: './dist',
    hot: true,     // Enables Hot Module Replacement
    open: true,    // Opens browser automatically
    port: 3000,
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },

  // 5. Plugins to extend Webpack functionality
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // This tells Webpack to use YOUR HTML
      filename: 'index.html',
    }),
  ],
};
