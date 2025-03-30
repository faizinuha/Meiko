const path = require('path');

module.exports = {
    target: 'webworker',
    entry: './src/extension.ts',
    output: {
        path: path.resolve(__dirname, 'dist/web'),
        filename: 'extension.js',
        libraryTarget: 'commonjs'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            }
        ]
    },
    externals: {
        vscode: 'commonjs vscode'
    }
};
