const {getDefaultConfig} = require("expo/metro-config");
const {withNativeWind} = require("nativewind/metro");
const {withReactNativeCSS} = require("react-native-css/metro");

const config = getDefaultConfig(__dirname);

const {transformer, resolver} = config;

config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
};

config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
};

module.exports = withReactNativeCSS(
    withNativeWind(config, {
        input: "./global.css",
    }),
    {
        globalClassNamePolyfill: true,
    },
);
