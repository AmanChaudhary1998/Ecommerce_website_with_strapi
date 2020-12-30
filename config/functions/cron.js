'use strict';

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#cron-tasks
 */

module.exports = {
  /**
   * Simple example.
   * Every monday at 1am.
   */
  '* * * * *': async () => {
    const products = await strapi.services.product.find({});
    const ids = [];

    for (const { stock, soldQuantity, _id, isSoldOut } of products) {
      if (stock === soldQuantity && !isSoldOut) {
        ids.push(_id);
      }
    }
    await strapi.query('product').model.updateOne(
      { _id: { $in: ids } },
      {
        $set: {
          isSoldOut: true,
        },
      },
    );
    console.log(`cron ran updated products sold out status ${ids}`);
  },
};
