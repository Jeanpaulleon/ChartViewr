const path = require('path');

module.exports = {
    mode: 'production',
    target: 'electron-renderer',
    entry: './src/renderer.mjs',
    devtool: 'source-map', // This enables source mapping
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'), // This should point to the 'dist' directory at the root of your project
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.mjs', '.json'],
        alias: {
            // Correct alias path for lightweight-charts using .mjs file for ES modules
            'lightweight-charts': path.resolve(__dirname, 'node_modules/lightweight-charts/dist/lightweight-charts.production.mjs'),
        },
        fallback: {
            fs: false,
            tls: false,
            net: false,
            path: false,
            zlib: false,
            http: false,
            https: false,
            stream: false,
            crypto: false,
            util: false,
            os: false,
        },
    },
};
