const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
module.exports = {
    reactStrictMode: true,
    future: {
        webpack5: true,
    },
    webpack: (config) => {
        // config.resolve.fallback = {};
        config.plugins.push(
            new NodePolyfillPlugin({ excludeAliases: ['process'] })
        );

        return config;
    },
};
