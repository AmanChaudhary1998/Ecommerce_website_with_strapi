'use strict';

const axios = require('axios');

const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const form = new FormData();

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /**
   * Create product
   *
   * @return {Product}
   */

  async create(ctx) {
    let images = [];

    const imageUrl = `${process.env.HOST_URL}/upload`;

    if (
      ctx.request.files &&
      ctx.request.files.images &&
      ctx.request.files.images.length
    ) {
      try {
        for (const file of ctx.request.files.images) {
          form.append(
            'files',
            fs.createReadStream(`${file.path}`),
            `${file.path}${path.extname(file.name)}`,
          );
        }
        const data = await axios({
          method: 'POST',
          url: imageUrl,
          data: form,
          headers: {
            ...form.getHeaders(),
          },
        });
        if (data.data && data.data.length) {
          images = data.data.map((responseData) => responseData.id);
        }
      } catch (error) {
        console.log({ error });
      }
    }
    const { user } = ctx.state;

    const payload = {
      ...ctx.request.body,
      user,
      images,
      soldQuantity: 0,
    };

    const productImageUrl = process.env.HOST_URL;

    const product = await strapi.services.product.create(payload);
    return {
      ...product,
      images: product.images.map((image) => ({
        small:
          'small' in image.formats
            ? `${productImageUrl}${image.formats.small.url}`
            : '',
        medium:
          'medium' in image.formats
            ? `${productImageUrl}${image.formats.medium.url}`
            : '',
        large:
          'large' in image.formats
            ? `${productImageUrl}${image.formats.large.url}`
            : '',
        thumbnail:
          'thumbnail' in image.formats
            ? `${productImageUrl}${image.formats.thumbnail.url}`
            : '',
      })),
    };
  },

  async find(ctx) {
    const imageUrl = process.env.HOST_URL;

    console.log({ imageUrl, port: process.env.PORT });
    const products = await strapi.services.product.find({});

    return products.map((product) => ({
      ...product,
      images: product.images.map((image) => ({
        small:
          'small' in image.formats
            ? `${imageUrl}${image.formats.small.url}`
            : '',
        medium:
          'medium' in image.formats
            ? `${imageUrl}${image.formats.medium.url}`
            : '',
        large:
          'large' in image.formats
            ? `${imageUrl}${image.formats.large.url}`
            : '',
        thumbnail:
          'thumbnail' in image.formats
            ? `${imageUrl}${image.formats.thumbnail.url}`
            : '',
      })),
    }));
  },

  async findOne(ctx) {
    const imageUrl = process.env.HOST_URL;
    const productId = ctx.params.id;

    console.log({ imageUrl, port: process.env.PORT });
    const product = await strapi.services.product.findOne({ id: productId });

    return {
      ...product,
      images: product.images.map((image) => ({
        original:
          'medium' in image.formats
            ? `${imageUrl}${image.formats.medium.url}`
            : '',
        thumbnail:
          'thumbnail' in image.formats
            ? `${imageUrl}${image.formats.thumbnail.url}`
            : '',
      })),
    };
  },
};
