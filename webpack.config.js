const path = require('path');
const pkg = require('./package.json');

module.exports = {
  entry: `./src/${pkg.entry}.ts`,
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
    '@emotion/core': '@emotion/core',
    '@emotion/styled': '@emotion/styled',
    '@builder.io/react': '@builder.io/react',
    '@builder.io/sdk': '@builder.io/sdk',
    '@builder.io/app-context': '@builder.io/app-context',
    '@material-ui/core': '@material-ui/core',
    '@material-ui/icons': '@material-ui/icons',
    mobx: 'mobx',
    'mobx-state-tree': 'mobx-state-tree',
    'mobx-react': 'mobx-react',
  },
  output: {
    filename: pkg.output,
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'system',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      "@application": path.resolve(process.cwd(), 'src/application/'),
      "@components": path.resolve(process.cwd(), 'src/components/'),
      "@core": path.resolve(process.cwd(), 'src/core/'),
      "@services": path.resolve(process.cwd(), 'src/services/'),
      "@utils": path.resolve(process.cwd(), 'src/utils/')
    }
  },
  module: {
    rules: [
      {
        rules: [
          {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader', 'postcss-loader'],
          },
        ],
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
    ],
  },
  devServer: {
    compress: true,
    port: 1268,
    static: {
      directory: path.join(__dirname, './dist'),
    },
    headers: {
      'Access-Control-Allow-Private-Network': 'true',
      'Access-Control-Allow-Origin': '*',
    },
  },
};
