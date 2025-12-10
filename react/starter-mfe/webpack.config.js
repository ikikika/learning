const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const { GenerateSW } = require('workbox-webpack-plugin');
const {
  getPortForRole,
  getDemoRemoteUrl,
} = require('./scripts/load-env.cjs');

const ROOT = __dirname;

function readRole() {
  const metaPath = path.join(ROOT, 'starter.role.json');
  if (!fs.existsSync(metaPath)) {
    return 'standalone';
  }
  try {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    return meta.role || 'standalone';
  } catch {
    return 'standalone';
  }
}

function federationOptions(role) {
  const shared = {
    react: { singleton: true, requiredVersion: false, eager: false },
    'react-dom': { singleton: true, requiredVersion: false, eager: false },
  };

  if (role === 'shell') {
    const remoteUrl = getDemoRemoteUrl();
    return {
      name: 'shell',
      filename: 'remoteEntry.js',
      remotes: {
        demoRemote: `demoRemote@${remoteUrl}`,
      },
      exposes: {},
      shared,
    };
  }

  if (role === 'remote') {
    return {
      name: 'demoRemote',
      filename: 'remoteEntry.js',
      exposes: {
        './Demo': './src/features/demo',
      },
      remotes: {},
      shared,
    };
  }

  // standalone: no remotes / exposes
  return {
    name: 'standalone',
    filename: 'remoteEntry.js',
    remotes: {},
    exposes: {},
    shared,
  };
}

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';
  const role = readRole();
  const port = getPortForRole(role);
  const demoRemoteUrl = getDemoRemoteUrl();

  const plugins = [
      new HtmlWebpackPlugin({
        template: path.join(ROOT, 'public/index.html'),
      }),
      new webpack.DefinePlugin({
        __STARTER_ROLE__: JSON.stringify(role),
        __STARTER_DEMO_REMOTE_URL_DEFAULT__: JSON.stringify(demoRemoteUrl),
      }),
      new ModuleFederationPlugin(federationOptions(role)),
    ];

    if (isProd) {
      plugins.push(
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
      );
    }

    return {
    entry: path.join(ROOT, 'src/main.tsx'),
    output: {
      path: path.join(ROOT, 'dist'),
      filename: isProd ? '[name].[contenthash].js' : '[name].js',
      publicPath: 'auto',
      clean: true,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@': path.join(ROOT, 'src'),
        '@active-routes':
          role === 'shell'
            ? path.join(ROOT, 'src/app/routes/shellRoutes.tsx')
            : role === 'remote'
              ? path.join(ROOT, 'src/app/routes/remoteRoutes.tsx')
              : path.join(ROOT, 'src/app/routes/standaloneRoutes.tsx'),
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: { onlyCompileBundledFiles: true },
          },
          exclude: /node_modules/,
        },
        {
          test: /\.module\.scss$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  namedExport: false,
                  exportLocalsConvention: 'as-is',
                  localIdentName: '[name]__[local]__[hash:base64:5]',
                },
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.scss$/,
          exclude: /\.module\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins,
    devServer: {
      port,
      historyApiFallback: true,
      hot: true,
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
    devtool: isProd ? 'source-map' : 'eval-source-map',
  };
};
