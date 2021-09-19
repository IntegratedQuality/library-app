module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: './src/index.js',
    output: {
      path: __dirname + '/public',
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.js[x]?/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                // '@babel/preset-env',
                '@babel/preset-react'
              ],
              plugins: ['@babel/plugin-syntax-jsx']
            }
          }
        }
      ]
    },
    watch: true,
    watchOptions: {
      ignored: [
        "node_modules",
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json']
    }
  };