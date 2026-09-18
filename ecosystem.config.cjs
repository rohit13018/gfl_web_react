// pm2 config for serving the built SPA (dist/) as a static site.
// .cjs because package.json sets "type": "module".
// Uses pm2's built-in static server (script: 'serve') with SPA fallback.
module.exports = {
  apps: [
    {
      name: 'cxo-web',
      script: 'serve',
      env: {
        PM2_SERVE_PATH: './dist',
        PM2_SERVE_PORT: 3000,
        PM2_SERVE_SPA: 'true',
        PM2_SERVE_HOMEPAGE: '/index.html',
      },
      instances: 1,
      autorestart: true,
      watch: false,
    },
  ],
}
