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

const plugins = [
  postcss({
    preprocessor: (_, id) =>
      new Promise(resolve => {
        const result = sass.renderSync({ file: id });
        resolve({ code: result.css.toString() });
      }),
    plugins: [autoprefixer],
    minimize: true,
    sourceMap: false,
    extract: pkg.style,
    extensions: [".sass", ".scss", ".css"]
  }),
  babel({
    runtimeHelpers: true,
    exclude: "node_modules/**"
  }),
  resolve(),
  localResolver(),
  commonjs(),
  terser({
    sourcemap: true,
    output: {
      comments: "false"
    }
  }),
  copy({
    targets: [{ src: "src/styles/**/*", dest: "dist/styles" }]
  }),
  filesize()
].filter(Boolean);

const resolutions = {
  globals: {
    react: "React",
    "react-is": "reactIs",
    "rc-trigger": "Trigger"
  },
  exports: "named"
};

const output = [
  {
    file: pkg.fallback,
    format: "umd",
    name: "UMD-MDEditor",
    ...resolutions
  },
  {
    file: pkg.main,
    format: "cjs",
    name: "CJS-MDEditor",
    ...resolutions
  },
  {
    file: pkg.browser,
    format: "esm",
    name: "MDEditor",
    ...resolutions
  }
];

export default {
  input: "./src/index.js",
  output,
  external: ["react", "react-dom", "rc-trigger"],
  plugins
};
