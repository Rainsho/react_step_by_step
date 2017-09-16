module.exports = {
    entry: './src/index.jsx',
    output: {
        filename: './dist/bundle.js',
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'react'],
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    }
}
