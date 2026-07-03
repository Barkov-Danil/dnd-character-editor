const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Support Expo Router file-based routing with app._layout
config.resolver.extraNodeModules = config.resolver.extraNodeModules || {};
config.resolver.sourceExts = config.resolver.sourceExts || [];

module.exports = config;