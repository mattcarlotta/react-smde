import babel from "rollup-plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import filesize from "rollup-plugin-filesize";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import { localResolver } from "./utils/resolver";
import pkg from "./package.json";

const outputs = [
	{ file: "main", format: "cjs" },
	{ file: "fallback", format: "umd" },
	{ file: "module", format: "esm" },
];

export default {
	input: "./src/index.js",
	output: outputs.map(({ file, format }) => ({
		file: pkg[file],
		name: "SMDEditor",
		format,
		globals: {
			react: "React",
			"react-is": "reactIs",
			"react-dom": "ReactDOM",
			"styled-components": "styled",
			"@material-ui/core/Tooltip": "Tooltip",
		},
		exports: "named",
	})),
	external: [
		"react",
		"react-dom",
		"styled-components",
		"@material-ui/core/Tooltip",
	],
	plugins: [
		babel({
			runtimeHelpers: true,
			exclude: "node_modules/**",
		}),
		resolve(),
		localResolver(),
		commonjs(),
		terser({
			output: {
				comments: "false",
			},
		}),
		filesize(),
	],
};
