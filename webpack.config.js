const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const LiveReloadPlugin = require('webpack-livereload-plugin')

const config = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'out'),
  },
}

module.exports = [
  {
    target: 'electron-main',
    entry: { main: './src/main/index.ts' },
    externals: {
      sharp: 'commonjs sharp',
    },
    ...config,
  },
  {
    target: 'electron-renderer',
    entry: { renderer: './src/renderer/index.tsx' },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'frisky.chat',
        templateContent: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
            </head>
            <body>
              <div id="root"></div>
            </body>
            </html>
          `,
      }),
      new LiveReloadPlugin({
        port: 35729,
        appendScriptTag: true,
      }),
    ],
    ...config,
  },
]
