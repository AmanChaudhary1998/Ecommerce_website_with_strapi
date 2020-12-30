module.exports = ({ env }) => {
  return {
    email: {
      provider: 'sendgrid',
      providerOptions: {
        apiKey: process.env.SENDGRID_API_KEY,
      },
      settings: {
        defaultFrom: process.env.FROM_EMAIL,
      },
    },
  };
};
