// =============================================================== //
// ENVS                                                            //
// =============================================================== //

const { ANALZYER, APIPORT, NODE_ENV, NODE_ENV_DEV, PORT } = process.env;

const inDevelopment = NODE_ENV === "development";
const inProduction = NODE_ENV === "production";
const inStaging = NODE_ENV_DEV === "staging";

module.exports = {
  /*  boolean to use bundle analyzer */
  analyze: ANALZYER,
  /* current API port */
  APIPORT,
  /* current working directory */
  currentDirectory: process.cwd(),
  inDevelopment,
  inProduction,
  inStaging,
  /* how class names will be defined in the DOM */
  localIdentName: "[local]___[hash:base64:5]",
  /* current ENV */
  NODE_ENV,
  /*  application's current port */
  PORT
};
