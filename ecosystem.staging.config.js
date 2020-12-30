module.exports = {
  apps: [
    {
      name: 'nceptio-api-staging',
      script: 'yarn',
      args: 'develop',
      log_type: 'json',
      time: true,
      interpreter: '/bin/bash',
      log_date_format: 'DD-MM-YYYY',
      env: {
        NODE_ENV: 'production',
        name: 'nceptio-api-staging',
        APP_LOG_LEVEL: 'true',
        HOST: '127.0.0.1',
        PORT: '3022',
        DATABASE_NAME: 'nceptio-staging',
        HOST_URL: 'https://api.nceptio.webelight.co.in',
        STRAPI_LICENSE: 'RjJiaUdtVnlIOWwrV1AzbkQ2aS83VjQwY2JVbGwvQW5qWXhNNXdzWHR3RTJKQ29KSkpOcGFJVnlHdktWcytjeXNlWHJicmdJUnpxNERxWjlhQWl5SlBTQWJtVzVuOUFPcEpiVEIyZjRZeXNjVUd4NHRDTFBGQWNUZkFXU2w1ZkxVZDlPQ0tVMTdJK2JkNlRCRmcrTzBvOTU0ZVpqM1BPQnYxZ2JWT2k3bFVjdTM3L0lPTzVxR2R3aUlrVmFUOThWWmt5STRRTjRJODBDcXRWSC8zVXYwS29vbWZhY3FUUW1GV0NBYmJET2RKTTRmT1gzSU1MTCtmSlNBTW5ONkNncEV5WjhFc2J3MXJhUVFaQk80ZVNZTTJJazN6QUk3aFhLQTZESDlDQ1Y1cWtPZkNQdVlwWjV3bndVU3M5aGVEcTZya2g0MjBJZmFWM2dRNHU1MmtHcnJnPT0KZXlKMGVYQmxJam9pWW5KdmJucGxJaXdpWTNWemRHOXRaWEpKWkNJNklqRTJRbEkzY0ZOSk5qbDRRMm94U0ZsRUlpd2laWGh3YVhKbFFYUWlPaUl5TURJd0xURXlMVEUzVkRBNU9qTTBPakEwTGpBd01Gb2lMQ0pwYzFSeWFXRnNJanAwY25WbExDSnNhV05sYm5ObFMyVjVJam9pTm1NeU1UZGxZekl0TmpZM05TMDBaR00zTFRoaFlqa3RNakEzWW1JelkyWTVOVGsxSWl3aVkzSmxZWFJsWkVGMElqb3hOakEyT1RnNE1EVXhOalkxZlE9PQ==',
        SENDGRID_API_KEY: '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',
        STRIPE_SECRET: 'sk_test_QST39Lv1lI51k9bCfI6GIA3I00BJReN0Ob',
        SENDGRID_API_KEY: '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',
        FROM_EMAIL: 'webelight2020@gmail.com',
      },
    },
  ],
};
