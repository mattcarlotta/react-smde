import babel from "rollup-plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import copy from "rollup-plugin-copy";
import filesize from "rollup-plugin-filesize";
import resolve from "@rollup/plugin-node-resolve";
import sass from "node-sass";
import autoprefixer from "autoprefixer";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import { localResolver } from "./utils/resolver";
import pkg from "./package.json";

const resolutions = {
	globals: {
		react: "React",
		"react-is": "reactIs",
		"rc-tooltip": "Tooltip",
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
	external: ["react", "react-dom", "rc-tooltip", "styled-components"],
	plugins: [
		postcss({
			preprocessor: (_, id) =>
				new Promise(resolve => {
					const result = sass.renderSync({ file: id });
					resolve({ code: result.css.toString() });
				}),
			plugins: [autoprefixer],
			minimize: true,
			sourceMap: false,
			extract: pkg.styles,
			extensions: [".sass", ".scss", ".css"],
		}),
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
		copy({
			targets: [{ src: "src/styles/**/*", dest: "dist/styles" }],
		}),
		filesize(),
	],
};
