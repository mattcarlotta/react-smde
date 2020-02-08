const MiniCssExtractPlugin = require("mini-css-extract-plugin").loader;
const postcssNormalize = require("postcss-normalize");
const autoprefixer = require("autoprefixer");
const postcssFixes = require("postcss-flexbugs-fixes");
const postcssEnv = require("postcss-preset-env")({
	autoprefixer: {
		flexbox: "no-2009",
	},
	stage: 3,
});
const { imagesFolder, fontsFolder } = require("./paths");
const { inDevelopment, localIdentName } = require("./envs");

// =============================================================== //
// WEBPACK RULES                                                   //
// =============================================================== //

/* defines a javascript rule */
const jsRule = ({ enforce, loader, options }) => ({
	enforce: enforce || "post",
	test: /\.(js|jsx)$/,
	loader,
	exclude: /(node_modules)/,
	options: options || {},
});

/* defines a media (font/image) rule */
const mediaRule = ({ test, outputPath }) => ({
	test,
	use: [
		{
			loader: "file-loader",
			options: {
				outputPath,
			},
		},
	],
});

/* defines a SCSS rule */
const cssRule = ({ exclude, modules, sourceMap, test }) => ({
	test,
	exclude,
	use: [
		inDevelopment ? "style-loader" : MiniCssExtractPlugin,
		{
			loader: "css-loader",
			options: {
				sourceMap: sourceMap || !inDevelopment,
				modules: {
					mode: modules ? "local" : "global",
					localIdentName,
				},
				localsConvention: "camelCase",
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
	],
});

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

module.exports = [
	/* handle React JS files */
	jsRule({
		loader: "babel-loader",
		options: {
			cacheDirectory: inDevelopment,
			cacheCompression: false,
		},
	}),
	/* handle image assets */
	mediaRule({
		test: /\.(png|jpg|gif|svg)$/,
		outputPath: imagesFolder,
	}),
	/* handle font assets */
	mediaRule({
		test: /\.(woff2|ttf|woff|eot)$/,
		outputPath: fontsFolder,
	}),
	/* handles CSS imports */
	cssRule({
		test: cssRegex,
		exclude: cssModuleRegex,
	}),
	/* handles CSS module imports */
	cssRule({
		test: cssModuleRegex,
		modules: true,
	}),
	/* handles SCSS imports */
	cssRule({
		test: sassRegex,
		exclude: sassModuleRegex,
	}),
	/* handles SCSS module imports */
	cssRule({
		test: sassModuleRegex,
		modules: true,
	}),
];
