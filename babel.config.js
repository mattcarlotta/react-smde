const aliasDirs = require("alias-dirs");

module.exports = function(api) {
	const inProd = api.env("production");
	const inTesting = api.env("testing");
	api.cache(() => process.env.NODE_ENV);

	return {
		presets: [
			"@babel/preset-react",
			!inTesting
				? ["@babel/preset-env", { modules: false, loose: true }]
				: "@babel/preset-env",
		].filter(Boolean),
		plugins: [
			"@babel/plugin-transform-runtime",
			"@babel/plugin-proposal-export-namespace-from",
			"@babel/plugin-proposal-export-default-from",
			["@babel/plugin-proposal-class-properties", { loose: true }],
			[
				"module-resolver",
				{
					alias: aliasDirs(),
				},
			],
			[
				"babel-plugin-styled-components",
				{
					displayName: true,
				},
			],
			inProd && [
				"transform-react-remove-prop-types",
				{
					mode: "remove",
					removeImport: true,
				},
			],
			inProd && ["react-remove-properties", { properties: ["data-testid"] }],
		].filter(Boolean),
	};
};
