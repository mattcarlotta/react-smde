import babel from "rollup-plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import filesize from "rollup-plugin-filesize";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import { localResolver } from "./utils/resolver";
import pkg from "./package.json";

const resolutions = {
	globals: {
		react: "React",
		"react-is": "reactIs",
		"react-dom": "ReactDOM",
		"styled-components": "styled",
	},
	exports: "named",
};

export default {
	input: "./src/index.js",
	output: [
		{
			file: pkg.main,
			format: "cjs",
			...resolutions,
		},
		{
			file: pkg.fallback,
			format: "umd",
			name: "MDEditor",
			...resolutions,
		},
		{
			file: pkg.module,
			format: "esm",
			...resolutions,
		},
	],
	external: ["react", "react-dom", "styled-components"],
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
