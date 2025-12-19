const { merge } = require('webpack-merge');
const { GenerateSW } = require('workbox-webpack-plugin');
const { getAppContext, createCommonConfig } = require('./webpack.common');

module.exports = () => {
  const ctx = getAppContext();

  return merge(createCommonConfig(ctx), {
    mode: 'production',
    devtool: 'source-map',
    output: {
      filename: '[name].[contenthash].js',
      // Shell/host: keep relative/`auto` so assets match the page origin.
      publicPath: process.env.PUBLIC_PATH || 'auto',
    },
    plugins: [
      new GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: { cacheName: 'pages' },
          },
        ],
      }),
    ],
  });
};
