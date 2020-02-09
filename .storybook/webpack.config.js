const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const postcssNormalize = require("postcss-normalize");
const autoprefixer = require("autoprefixer");
const postcssFixes = require("postcss-flexbugs-fixes");
const postcssEnv = require("postcss-preset-env")({
	autoprefixer: {
		flexbox: "no-2009",
	},
	stage: 3,
});
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = ({ config }, configType) => {
	const inDevelopment = configType === "development";

	config.optimization = {
		...config.optimization,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					parse: {
						// We want terser to parse ecma 8 code. However, we don't want it
						// to apply any minification steps that turns valid ecma 5 code
						// into invalid ecma 5 code. This is why the 'compress' and 'output'
						// sections only apply transformations that are ecma 5 safe
						// https://github.com/facebook/create-react-app/pull/4234
						ecma: 8,
					},
					compress: {
						ecma: 5,
						warnings: false,
						// Disabled because of an issue with Uglify breaking seemingly valid code:
						// https://github.com/facebook/create-react-app/issues/2376
						// Pending further investigation:
						// https://github.com/mishoo/UglifyJS2/issues/2011
						comparisons: false,
						// Disabled because of an issue with Terser breaking valid code:
						// https://github.com/facebook/create-react-app/issues/5250
						// Pending further investigation:
						// https://github.com/terser-js/terser/issues/120
						inline: 2,
					},
					mangle: {
						safari10: true,
					},
					output: {
						ecma: 5,
						comments: false,
						ascii_only: true,
					},
				},
				parallel: true,
				cache: true,
				sourceMap: false,
			}),
			/* compile and optimize SCSS to CSS */
			new OptimizeCSSAssetsPlugin(
				!inDevelopment
					? {
							cssProcessorOptions: {
								map: { inline: false, annotation: true },
							},
					  }
					: {},
			),
		],
	};

	config.module.rules.push({
		test: /\.scss$/,
		sideEffects: true,
		use: [
			inDevelopment && "extracted-loader",
			!inDevelopment && MiniCssExtractPlugin.loader,
			{
				loader: "css-loader",
				options: {
					sourceMap: inDevelopment,
					importLoaders: 1,
				},
			},
			{
				loader: "postcss-loader",
				options: {
					ident: "postcss",
					plugins: () => [
						postcssFixes,
						postcssEnv,
						autoprefixer(),
						postcssNormalize(),
					],
					sourceMap: inDevelopment,
				},
			},
			"sass-loader",
		].filter(Boolean),
	});

	if (!inDevelopment) {
		config.plugins.push(
			new MiniCssExtractPlugin({
				filename: "[name].[contenthash].css",
			}),
		);
	}

	return config;
};
