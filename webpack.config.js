// 引入模块
const OS = require('os');
const path = require('path');
const glob = require('glob');
const webpack = require('webpack');

/*------------------------------------------------ Plugins -----------------------------------------------------*/

const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');

/*------------------------------------------------ Common Config -----------------------------------------------------*/

const ROOT_PATH = path.resolve(__dirname); // 配置路径
const SOURCE_PATH = path.resolve(__dirname, 'src');
const DIST_PATH = path.resolve(ROOT_PATH, 'dist');

const FILE_MATCHER = /([^\/]+)\.(js)$/i;
const FILE_POOL = ['evt'];

/*------------------------------------------------ entry -----------------------------------------------------*/

const entryObject = (function() {
  let files = glob.sync(SOURCE_PATH + '/*');
  let entryMap = {};
  if (files.length) {
    files.forEach(file => {
      const name = file.match(FILE_MATCHER);
      if (name && FILE_POOL.includes(name[1])) {
        entryMap[name[1]] = [file];
      }
    });
  }
  return entryMap;
})();

let config = [];

function generateConfig(name) {
  const uglify = name.indexOf('min') > -1;
  const insideConfig = {
    entry: entryObject,
    output: {
      path: DIST_PATH,
      filename: `${name}.js`,
      publicPath: '/dist/',
      libraryTarget: 'umd',
      library: 'evt'
    },

    // 模块编译配置
    module: {
      rules: [
        {
          test: /\.js$/i,
          use: {
            loader: 'babel-loader'
          },
          include: SOURCE_PATH,
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    plugins: [
      new CleanWebpackPlugin(['dist'], {
        root: ROOT_PATH,
        verbose: false
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      })
    ]
  };
  if (uglify) {
    insideConfig.plugins.push(
      // 利用多线程提升打包速度
      new UglifyjsWebpackPlugin({
        uglifyOptions: {
          minimize: true,
          compress: true
        }
      })
    );
  }
  return insideConfig;
}

['evt', 'evt.min'].forEach(function(key) {
  config.push(generateConfig(key));
});

// 配置
module.exports = config;
