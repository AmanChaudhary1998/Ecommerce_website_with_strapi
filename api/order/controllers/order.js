'use strict';

const {
  actionMessages: {
    error: { cardDetailsRequired, productsEmpty, notEnoughQuantity },
    success: { orderPlaced },
  },
} = require('../../../helper/action-messages');
const { fromDecimalToInt } = require('../../../helper/helper');
const { send } = require('../../email/services/Email');

const {
  createCardToken,
  createCharge,
} = require('../../payment/services/payment');

const imageUrl = process.env.HOST_URL;

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create({ request: { body }, response, state }) {
    console.log(body);
    const { card, products, subTotal, contactDetails } = body;
    const {
      user: { id, email, fullName },
    } = state;

    if (!products.length) {
      return response.badRequest(productsEmpty);
    }

    if (!card) {
      return response.badRequest(cardDetailsRequired);
    }

    const checkCard = await createCardToken(card);

    if (checkCard.isError) {
      return response.badRequest(checkCard.error);
    }

    const productIds = products.map(({ product }) => product);
    const userProducts = await strapi.query('product').model.find(
      {
        _id: { $in: productIds },
      },
      { soldQuantity: 1, stock: 1, name: 1 },
    );

    const checkStoke = userProducts.find(
      ({ stock, soldQuantity }) => stock === soldQuantity,
    );

    if (checkStoke) {
      return response.badRequest(
        `One of your product '${checkStoke.name}' is currently out of stock`,
      );
    }

    const checkQuantity = userProducts.find(({ _id, stock, soldQuantity }) => {
      const { quantity } = products.find(
        ({ product }) => String(product) === String(_id),
      );
      return quantity > stock - soldQuantity;
    });

    if (checkQuantity) {
      const { name, stock, soldQuantity } = checkQuantity;
      const availableStoke = stock - soldQuantity;

      return response.badRequest(notEnoughQuantity(name, availableStoke));
    }

    const amount = fromDecimalToInt(subTotal);
    const charge = await createCharge(amount, checkCard.id);

    if (charge.isError) {
      return ctx.response.badRequest(charge.error);
    }

    const productData = userProducts.map(({ _id, soldQuantity }) => {
      const { quantity } = products.find(
        ({ product }) => String(product) === String(_id),
      );
      return {
        updateOne: {
          filter: { _id },
          update: {
            $set: {
              soldQuantity: soldQuantity + quantity,
            },
          },
        },
      };
    });
    await strapi.query('product').model.bulkWrite(productData);

    const mapOrderData = products.map(({ product, total, quantity }) => ({
      product,
      quantity,
      contactDetails,
      isPaymentDone: true,
      user: id,
      orderNumber: `${Math.floor(100000 + Math.random() * 9000000000)}`,
      amount: total,
    }));

    const storeOrders = await strapi
      .query('order')
      .model.insertMany(mapOrderData);

    const mapPaymentData = storeOrders.map((order) => {
      const { total } = products.find(
        ({ product }) => String(product) === String(order.product),
      );
      return {
        user: id,
        order: order._id,
        product: order.product,
        amount: total,
        order: order.id,
        paymentId: charge.id,
      };
    });
    await strapi.query('payment').model.insertMany(mapPaymentData);
    await strapi
      .query('cart')
      .model.deleteMany({ product: { $in: productIds }, user: id });

    const orderedProducts = storeOrders.map((orderData) => orderData._id);
    console.log(
      { orderedProducts },
      {
        _id: { $in: orderedProducts },
        user: id,
      },
    );

    const storedOrders = await strapi
      .query('order')
      .model.find({
        _id: { $in: orderedProducts },
        user: id,
      })
      .sort({ createdAt: -1 })
      .populate({
        path: 'product user',
      })
      .lean();

    const mapEmailText = storedOrders.reduce((acc, value, index) => {
      acc += `Order placed successfully for product <br> ${value.product.name} with amount of ${value.amount}, order id is #${value.orderNumber} <br>`;
      return acc;
    }, '');

    try {
      await send({
        to: email,
        subject: orderPlaced,
        html: `Hi ${fullName} <br> ${mapEmailText}`,
      });
    } catch (error) {
      console.log(error.response.body);
    }

    return storedOrders.map((order) => ({
      ...order,
      product: {
        ...order.product,
        images:
          order.product &&
          order.product.images.map((image) => ({
            original:
              'medium' in image.formats
                ? `${imageUrl}${image.formats.medium.url}`
                : '',
            thumbnail:
              'thumbnail' in image.formats
                ? `${imageUrl}${image.formats.thumbnail.url}`
                : '',
          })),
      },
    }));
  },

  async userOrders(ctx) {
    const userId = ctx.state ? ctx.state.user.id : ctx.user.id;

    const userOrders = await strapi
      .query('order')
      .model.find({ user: userId })
      .populate({
        path: 'product user',
      })
      .sort({ createdAt: -1 })
      .lean();

    return userOrders.map((order) => ({
      ...order,
      product: {
        ...order.product,
        images:
          order.product &&
          order.product.images.map((image) => ({
            original:
              'medium' in image.formats
                ? `${imageUrl}${image.formats.medium.url}`
                : '',
            thumbnail:
              'thumbnail' in image.formats
                ? `${imageUrl}${image.formats.thumbnail.url}`
                : '',
          })),
      },
    }));
  },
};
