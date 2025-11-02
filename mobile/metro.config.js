const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure JSX files are recognized
config.resolver.sourceExts = [...config.resolver.sourceExts, 'jsx', 'js'];

module.exports = config;
