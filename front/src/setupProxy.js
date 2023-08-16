const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api', // Change this to match your API route prefix
    createProxyMiddleware({
      target: 'https://vusalgaragozov-8206d1f48b5f.herokuapp.com',
      changeOrigin: true,
    })
  );
};
