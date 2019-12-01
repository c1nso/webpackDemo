const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const cssExtract = new ExtractTextWebpackPlugin({
	filename: 'css/css.css',
	disable: true
})
const lessExtract = new ExtractTextWebpackPlugin({
	filename: 'css/less.css',
	disable: true
})
// 多页 a.html index.js, b.html a.js
module.exports = {
	// entry 可以是个数组,对象，字符串
	// entry: {
	// 	index: './src/index.js',
	// 	a: './src/a.js'
	// },      // 入口
	entry: {
		index: './src/index.js'
	},      // 入口
	output: {
		// filename: 'build.[hash:8].js',
		// [name] 多出口
		filename: '[name].[hash:8].js',
		path: path.resolve('./build')
	},     // 出口
	devServer: {
		contentBase: './build',
		port: 3001,
		compress: true, // 服务器压缩
		open: false,     // 是否自动打开浏览器
		hot: true,      // 热更新
	},      // 开发服务器
	module: {
		rules: [
			{test: /\.css$/, use: cssExtract.extract({
					fallback: 'style-loader',
					use: [
						{ loader: "css-loader" },
						{ loader: "postcss-loader" }
					]
				})
			},
			{test: /\.less$/, use: lessExtract.extract({
					fallback: 'style-loader',
					use: [
						{ loader: "css-loader" },
						{ loader: "postcss-loader" },
						{ loader: "less-loader" },
					]
				})
			}
		]
	},         // 模块配置
	plugins: [
		cssExtract,
		lessExtract,
		new CopyWebpackPlugin([
			{
				from: './src/doc',
				to: 'public'
			}
		]),
		new webpack.HotModuleReplacementPlugin(),
		// 先清空build目录下文件再打包
		new CleanWebpackPlugin(),
		// 打包html插件
		// 将打包后的文件放到 index.html 中
		// new HtmlWebpackPlugin({
		// 	filename: 'a.html',     // 生成文件 a.html
		// 	template: './src/index.html',
		// 	title: '打包测试',
		// 	hash: true,
		// 	minify: {
		// 		removeAttributeQuotes: true,    // 移除双引号
		// 		collapseWhitespace: true        // 折叠一行
		// 	},
		// 	chunks: ['index']
		// }),
		// 配置多入口，就写多个 HtmlWebpackPlugin
		new HtmlWebpackPlugin({
			filename: 'b.html',     // 生成文件 b.html
			template: './src/index.html',
			title: '我是b入口',
			hash: true,
			minify: {
				removeAttributeQuotes: true,    // 移除双引号
				collapseWhitespace: true        // 折叠一行
			},
			chunks: ['a']
		})
	],        // 插件配置
	mode: 'development',    // 各种模式
	resolve: {},        // 配置解析
}


// webpack 配置开发服务器  webpack-dev-server
// webpack 插件，将html打包到build下可以自动引入生产的js


