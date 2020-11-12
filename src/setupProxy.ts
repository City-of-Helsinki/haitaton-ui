// eslint-disable-next-line
const { createProxyMiddleware } = require('http-proxy-middleware');

// eslint-disable-next-line
module.exports = function (app: any) {
  app.use(
    '/backend',
    createProxyMiddleware({
      target: 'http://localhost:8080/backend/',
      changeOrigin: true,
    })
  );
};

export {};
