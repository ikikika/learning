const path = require('path');
const { merge } = require('webpack-merge');
const {
  ROOT,
  getDevHost,
  getAppContext,
  createCommonConfig,
} = require('./webpack.common');

module.exports = () => {
  const ctx = getAppContext();
  const { role, port } = ctx;

  return merge(createCommonConfig(ctx), {
    mode: 'development',
    devtool: 'eval-source-map',
    output: {
      filename: '[name].js',
      // Remotes need an absolute publicPath because remoteEntry is injected via a
      // dynamic <script> where document.currentScript is null.
      publicPath:
        process.env.PUBLIC_PATH ||
        (role === 'remote'
          ? `http://${getDevHost()}:${port}/`
          : 'auto'),
    },
    devServer: {
      port,
      historyApiFallback: true,
      hot: true,
      allowedHosts: 'all',
      client: {
        overlay: false,
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      static: {
        directory: path.join(ROOT, 'public'),
      },
    },
  });
};
