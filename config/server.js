module.exports = ({ env }) => ({
  host: env('HOST', '127.0.0.1'),
  port: env.int('PORT', process.env.PORT),
  url: env('HOST_URL', process.env.HOST_URL),
  cron: {
    enabled: true,
  },
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'c5ccc84a5ab8634d40344153e2f2ffb6'),
    },
  },
});
