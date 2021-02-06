const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Uglify = require('uglifyjs-webpack-plugin');
// const glob = require('glob');
// const PurifyCSSPlugin = require("purifycss-webpack");
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')
const handlePageConfig = require('./handlePageConfig');
const env = process.env.NODE_ENV

let webpackConfig = {
  entry: {
    common: './src/common.js'
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'js/[name].js',
    publicPath: '/temp/'
  },
  devServer: {
    contentBase: './dist/'
  },
  module: {
    rules: [{
        test: /\.(png|jpg|gif|svg)/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 5,
            esModule: false,
            name: 'images/[name].[hash:7].[ext]'
          }
        }]
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['babel-preset-env', {
                targets: {
                  browser: ['> 1%']
                }
              }]
            ],
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          env == 'dev' ? {
            loader: 'style-loader'
          } : {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.css$/,
        use: [
          env == 'dev' ? {
            loader: 'style-loader'
          } : {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          'css-loader',
        ],
      },
      {
        test: /\.ejs$/,
        loader: 'ejs-loader',
      }
    ]
  },
  resolve: {
    //直接解释就是，数组内填入什么后缀，引入该后缀时可以文件名可以不带后缀
    extensions: ['.js', '.css', '.scss', '.tpl', '.png', '.jpg', '.ejs'],
    // root: [srcDir, nodeModPath],
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  plugins: [
    // new PurifyCSSPlugin({
    //   paths: glob.sync(path.join(__dirname, 'src/*.ejs')),
    //   minimize: true
    // }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
    new Uglify(),
    new CleanWebpackPlugin(),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'common',
          chunks: 'initial', 
          minChunks: 2, 
          minSize: 0 
        }
      }
    }
  }
}

if(env == 'dev') {
  delete webpackConfig.optimization
}

webpackConfig = handlePageConfig(webpackConfig)

module.exports = webpackConfig;