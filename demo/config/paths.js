const { resolve } = require("path");
const { currentDirectory } = require("./envs");

// =============================================================== //
// WEBPACK PATHS                                                   //
// =============================================================== //

const root = resolve(`${currentDirectory}/demo`);

module.exports = {
	/* project root directory */
	root,
	/* project publicPath */
	publicPath: "",
	/* compiled build output path (/docs) */
	outputPath: resolve(`${currentDirectory}/docs`),
	/* path to public folder (./public) */
	publicFolder: resolve(`${root}/public`),
	/* entry point to the application index (./src/index.js) */
	entryPath: resolve(`${root}/src/index.js`),
	/* path to index.html (build/index.html) */
	templatePath: resolve(`${root}/public/index.html`),
	/* path to favicon.ico (build/favicon.ico) */
	faviconPath: resolve(`${root}/public/favicon.ico`),
	/*  path to local source (/src) */
	localSrc: resolve(`${root}/src`),
	/* path to the globals.scss file (src/styles/globals/globals.scss) */
	globalCSS: resolve(`${root}/src/styles/globals`),
	/* compiled images build path (build/media) */
	imagesFolder: "media",
	/* compiled fonts build path (build/assets) */
	fontsFolder: "assets",
	/* compiled CSS build path (build/css) */
	cssFolder: "css",
	/* compiled JS build path (build/js) */
	jsFolder: "js",
};
