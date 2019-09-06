const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
/**
 * This is a server config which should be merged on top of common config
 */
module.exports = {
  mode: 'development',
  externals: [/(node_modules|main\..*\.js)/, nodeExternals({
    whitelist: [
      /^@agm\/core/,
      /^ngx-dropdown/,
      /ngx-malihu-scrollbar/,
      /ngx-mydatepicker/
    ]
  })],
  entry: {
    // This is our Express server for Dynamic universal
    server: './server.ts',
    // This is an example of Static prerendering (generative)
    prerender: './prerender.ts'
  },
  resolve: { extensions: [".js", ".ts"] },
  output: {
    // Puts the output at the root of the dist folder
    path: path.join(__dirname),
    filename: '[name].js'
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' },
      //below is the fix for image gallery keyboard error
      { test: /\.(ts|js)$/, 
        loader: 'regexp-replace-loader', 
        query: { 
            match: { 
                pattern: '\\[(Mouse|Keyboard|Focus)Event\\]', 
                flags: 'g' }, 
                replaceWith: '[]', 
            } 
        } 
    ]
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
      // fixes WARNING Critical dependency: the request of a dependency is an expression
      /(.+)?angular(\\|\/)core(.+)?/,
      path.join(__dirname, 'src'), // location of your src
      {} // a map of your routes
    ),
    new webpack.ContextReplacementPlugin(
      // fixes WARNING Critical dependency: the request of a dependency is an expression
      /(.+)?express(\\|\/)(.+)?/,
      path.join(__dirname, 'src'),
      {}
    )
  ],
  target: 'node',
  node: {
    __dirname: false
  },
};