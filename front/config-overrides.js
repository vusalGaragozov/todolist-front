const path = require('path');
const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.alias = {
    ...config.resolve.alias,
    '@alias': path.resolve(__dirname, 'alias'),
  };

  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.REACT_APP_BACKEND_URL': JSON.stringify(process.env.REACT_APP_BACKEND_URL),
    })
  );

  return config;
};
