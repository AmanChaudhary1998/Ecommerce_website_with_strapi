'use strict';

const stripe = require('stripe')(process.env.STRIPE_SECRET);

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  async createCardToken(card) {
    try {
      const token = await stripe.tokens.create({
        card,
      });
      return token;
    } catch (error) {
      return {
        isError: true,
        error: error.raw.message,
      };
    }
  },

  async createCharge(amount, source, description) {
    console.log({ amount, source, description });
    try {
      return await stripe.charges.create({
        amount,
        source,
        description,
        currency: 'usd',
      });
    } catch (error) {
      return {
        isError: true,
        error: error.raw.message,
      };
    }
  },
};
