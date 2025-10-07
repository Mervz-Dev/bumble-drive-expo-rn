const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const projectRoot = __dirname;

const config = getDefaultConfig(__dirname);
config.resolver.alias = {
  "@": path.resolve(projectRoot, "src"),
};

module.exports = withNativeWind(config, { input: "./global.css" });
