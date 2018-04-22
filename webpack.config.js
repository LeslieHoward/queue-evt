// 引入模块
const OS = require('os');
const path = require('path');
const glob = require('glob');
const webpack = require('webpack');

/*------------------------------------------------ Plugins -----------------------------------------------------*/

const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');

/*------------------------------------------------ Common Config -----------------------------------------------------*/

const ROOT_PATH = path.join(__dirname); // 配置路径
const SOURCE_PATH = path.join(__dirname, 'source');
const DIST_PATH = path.join(ROOT_PATH, '__build__');

const FILE_MATCHER = /([^\/]+)\.(js)$/i;

/*------------------------------------------------ entry -----------------------------------------------------*/

const entryObject = (function () {
	let files = glob.sync(SOURCE_PATH + '/*'),
		entryMap = {};
	if (files.length) {
		files.forEach(file => {
			const name = file.match(FILE_MATCHER);
			name ? (entryMap[name[1]] = [file]) : '';
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
			chunkFilename: '[id].chunk.js',
			publicPath: '/__build__/',
			libraryTarget: 'umd',
			library: 'evt'
		},

		// 模块编译配置
		module: {
			rules: [{
				test: /\.js?$/i,
				use: {
					loader: 'babel-loader',
					options: {
						babelrc: false,
						presets: [
							[
								'env',
								{
									target: {
										browsers: ['last 2 versions']
									},
									modules: false,
									useBuiltIns: true,
									debug: false
								}
							],
							'stage-0'
						],
						plugins: [
							[
								'transform-runtime',
								{
									helpers: false,
									polyfill: true,
									regenerator: true,
									moduleName: 'babel-runtime'
								}
							]
						]
					}
				},
				include: SOURCE_PATH
			}]
		},
		plugins: [
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
			}),
			new webpack.optimize.ModuleConcatenationPlugin(),
		]
	};
	if (uglify) {
		insideConfig.plugins.push(
			// 利用多线程提升打包速度
			new UglifyjsWebpackPlugin({
				uglifyOptions: {
					ie8: false,
					ecma: 5,
					mangle: true,
					minimize: true,
					output: {
						comments: false
					},
					compress: true
				},
				sourceMap: false,
				cache: false,
				parallel: OS.cpus().length
			})
		);
	}
	return insideConfig;
}

['evt', 'evt.min'].forEach(function (key) {
	config.push(generateConfig(key));
});

// 配置
module.exports = config;