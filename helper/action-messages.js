const actionMessages = {
  error: {
    cardDetailsRequired: 'Please provide card details',
    productRequired: 'Please add a product to body',
    productNotExists: "This product doesn't exist",
    productSoldOut: 'This product is sold out',
    productOrQuantityRequired: 'Product or quantity not provided',
    cannotUpdateCart: 'Cannot update cart',
    cartNotExists: 'Cart not exists',
    productsEmpty: 'Products are empty',
    notEnoughQuantity: (name, availableStoke) =>
      `Your product '${name}' don't have enough stock please reduce items to at least ${availableStoke}`,
  },
  success: {
    orderPlaced: 'Order placed successfully',
  },
};

module.exports = { actionMessages };
