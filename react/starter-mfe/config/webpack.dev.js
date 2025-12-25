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
  const { port } = ctx;

  return merge(createCommonConfig(ctx), {
    mode: 'development',
    devtool: 'eval-source-map',
    output: {
      filename: '[name].js',
      // Absolute publicPath so nested host URLs (e.g. /remote/:alias/route-1)
      // still resolve chunks from the origin root after refresh. Remotes also
      // need this because remoteEntry is injected via a dynamic <script>
      // where document.currentScript is null.
      publicPath:
        process.env.PUBLIC_PATH || `http://${getDevHost()}:${port}/`,
    },
    devServer: {
      port,
      historyApiFallback: {
        index: '/index.html',
        disableDotRule: true,
      },
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
