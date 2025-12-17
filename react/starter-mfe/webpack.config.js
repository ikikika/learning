const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const { GenerateSW } = require('workbox-webpack-plugin');
const {
  getPortForRole,
  getDevHost,
  getDemoRemoteUrl,
  getRemoteUrlsByAlias,
  getApiBaseUrl,
} = require('./scripts/load-env.cjs');
const {
  defaultNameForRole,
  toFederationName,
} = require('./scripts/app-name.cjs');
const { remotesFromMeta } = require('./scripts/remotes-config.cjs');

const ROOT = __dirname;

function readMeta() {
  const metaPath = path.join(ROOT, 'starter.role.json');
  if (!fs.existsSync(metaPath)) {
    return { role: 'standalone' };
  }
  try {
    return JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  } catch {
    return { role: 'standalone' };
  }
}

function resolveFederationName(meta) {
  const role = meta.role || 'standalone';
  if (meta.federationName) return meta.federationName;
  if (meta.name) return toFederationName(meta.name);
  return toFederationName(defaultNameForRole(role));
}

function buildRemotesMap(remoteEntries, urlsByAlias) {
  const remotes = {};
  for (const r of remoteEntries) {
    const url = urlsByAlias[r.alias] || '';
    remotes[r.alias] = `${r.federationName}@${url}`;
  }
  return remotes;
}

function federationOptions(role, federationName, remoteEntries, urlsByAlias) {
  const shared = {
    react: { singleton: true, requiredVersion: false, eager: false },
    'react-dom': { singleton: true, requiredVersion: false, eager: false },
  };

  if (role === 'shell') {
    return {
      name: federationName,
      filename: 'remoteEntry.js',
      remotes: buildRemotesMap(remoteEntries, urlsByAlias),
      exposes: {},
      shared,
    };
  }

  if (role === 'remote') {
    return {
      name: federationName,
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
    name: federationName,
    filename: 'remoteEntry.js',
    remotes: {},
    exposes: {},
    shared,
  };
}

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';
  const meta = readMeta();
  const role = meta.role || 'standalone';
  const federationName = resolveFederationName(meta);
  const remoteEntries = role === 'shell' ? remotesFromMeta(meta) : [];
  const urlsByAlias = getRemoteUrlsByAlias(remoteEntries);
  const appTitle = meta.name || defaultNameForRole(role);
  const port = getPortForRole(role);
  const demoRemoteUrl = getDemoRemoteUrl();
  const apiBaseUrl = getApiBaseUrl();

  const plugins = [
      new HtmlWebpackPlugin({
        template: path.join(ROOT, 'public/index.html'),
        title: appTitle,
      }),
      new webpack.DefinePlugin({
        __STARTER_ROLE__: JSON.stringify(role),
        __STARTER_DEMO_REMOTE_URL_DEFAULT__: JSON.stringify(demoRemoteUrl),
        __STARTER_REMOTES_CONFIG__: JSON.stringify(
          remoteEntries.map(({ alias, name, federationName: fed, expose, urlEnv }) => ({
            alias,
            name,
            federationName: fed,
            expose,
            urlEnv,
          })),
        ),
        __STARTER_REMOTES_URLS__: JSON.stringify(urlsByAlias),
        'process.env.API_BASE_URL': JSON.stringify(apiBaseUrl),
      }),
      new ModuleFederationPlugin(
        federationOptions(role, federationName, remoteEntries, urlsByAlias),
      ),
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
      // Shell/host: keep relative/`auto` so assets match the page origin.
      // Remotes need an absolute publicPath because remoteEntry is injected via a
      // dynamic <script> where document.currentScript is null.
      publicPath:
        process.env.PUBLIC_PATH ||
        (role === 'remote' && !isProd
          ? `http://${getDevHost()}:${port}/`
          : 'auto'),
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
    devtool: isProd ? 'source-map' : 'eval-source-map',
  };
};
