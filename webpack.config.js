const path = require('path')
const webpack = require('webpack')
const HappyPack = require('happypack')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const isDebug = !process.argv.includes('-p')

// Desarrollo
const publicPathDev = '/'
const libraryNameDev = 'react-ui-library-starter.js'
const browserSyncProxyPort = 3000
const webpackDevServerPort = 8080

// Productivo
const publicPathProd = '/'
const libraryNameProd = 'react-ui-library-starter.min.js'

let config = {
  plugins: [
    new HappyPack({
      id: 'images',
      cache: true,
      loaders: [
        {
          loader: 'url-loader'
        }
      ],
      threads: 4
    }),
    new HappyPack({
      id: 'js',
      cache: true,
      loaders: [
        {
          loader: 'babel-loader',
          query: {
            presets: ['react']
          },
          exclude: /(node_modules|bower_components)/
        },
        {
          loader: 'eslint-loader',
          exclude: /node_modules/
        }
      ],
      threads: 4
    }),
    new HtmlWebpackPlugin({
      template: './dist/index.template.html',
      inject: true
    })
  ],
  resolve: {
    extensions: ['*', '.js']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: isDebug ? publicPathDev : publicPathProd,
    filename: isDebug ? libraryNameDev : libraryNameProd,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        use: 'happypack/loader?id=images'
      },
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: 'happypack/loader?id=js'
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './dist',
    hot: true
  },
  devtool: isDebug ? 'source-map' : false
}

if (isDebug) {
  config.entry = [
    'webpack-dev-server/client?http://localhost:' + webpackDevServerPort,
    'webpack/hot/only-dev-server',
    './src/index.js'
  ]
  config.plugins.push(
    new BrowserSyncPlugin(
      {
        port: browserSyncProxyPort,
        proxy: 'localhost:' + webpackDevServerPort
      },
      // opciones
      {
        // Previene a BrowserSync recargar la página
        // y deja a Webpack Dev Server que tome el control
        reload: false
      }
    )
  )
  config.module.rules.push({
    test: /\.js$/,
    use: ['source-map-loader'],
    enforce: 'pre'
  })
} else {
  config.entry = './src/index.js'
  config.plugins.push(
    new CleanWebpackPlugin(['dist'], {
      root: __dirname,
      exclude: ['index.template.html', libraryNameDev, libraryNameDev + '.map']
    })
  )
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }))
}

module.exports = config
