'use strict';

const {
  actionMessages: {
    error: {
      productNotExists,
      productOrQuantityRequired,
      productSoldOut,
      cannotUpdateCart,
      cartNotExists,
    },
  },
} = require('../../../helper/action-messages');

const imageUrl = process.env.HOST_URL;

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    const { product, quantity, isShopMore } = ctx.request.body;
    console.log('ctx.request.body ', ctx.request.body);
    const user = ctx.state.user.id;
    console.log('ctx.sate.user.id ',ctx.state.user.id);

    if (!product || !quantity) {
      return ctx.response.badRequest(productOrQuantityRequired);
    }

    const productData = await strapi.services.product.findOne({
      id: product,
    });

    if (!productData) {
      return ctx.response.badRequest(productNotExists);
    }

    if (productData.isSoldOut) {
      return ctx.response.badRequest(productSoldOut);
    }

    const { name, stock, soldQuantity } = productData;
    const availableStoke = stock - soldQuantity;

    if (quantity > availableStoke) {
      return response.badRequest(
        `Your product '${name}' don't have enough stock please reduce items to at least ${availableStoke}`,
      );
    }

    const { price } = productData;

    const payload = {
      user,
      product,
      quantity,
      total: price * quantity,
    };

    const cart = await strapi.services.cart.findOne({
      user,
      product,
    });

    if (cart) {
      if (cart.user.id !== user) {
        return ctx.response.badRequest(cannotUpdateCart);
      }

      let userQuantity;
      if (isShopMore) {
        userQuantity = cart.quantity + quantity;
      }

      if (quantity < cart.quantity && !isShopMore) {
        const quantityDifference = cart.quantity - quantity;
        userQuantity = cart.quantity - quantityDifference;
      }

      if (quantity > cart.quantity && !isShopMore) {
        userQuantity = quantity;
      }

      if (cart.quantity === quantity && !isShopMore) {
        userQuantity = cart.quantity;
      }

      await strapi.services.cart.update(
        { id: cart.id },
        {
          quantity: userQuantity,
          total: price * userQuantity,
        },
      );

      return await this.userCart(ctx);
    }

    await strapi.services.cart.create(payload);

    return await this.userCart(ctx);
  },

  async userCart(ctx) {
    const user = ctx.state.user.id;

    const userCarts = await strapi.services.cart.find({
      user,
    });

    const userCartInformation = userCarts.map((cart) => ({
      ...cart,
      product: {
        ...cart.product,
        images: cart.product.images.map((image) => ({
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

    return {
      userCartInformation,
      subTotal: userCartInformation.reduce(
        (acc, value) => acc + value.total,
        0,
      ),
    };
  },

  async delete(ctx) {
    const { id } = ctx.params;

    const user = ctx.state.user.id;

    const userCartData = await strapi.services.cart.findOne({
      id,
      user,
    });

    if (!userCartData) {
      return ctx.response.badRequest(cartNotExists);
    }

    await strapi.services.cart.delete({ id });

    return await this.userCart(ctx);
  },
};
