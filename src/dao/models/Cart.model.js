const mongoose = require('mongoose')
const Product = require("./Product.model")
const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
    products: [{
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Product,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }]
  });
  
  const Cart = mongoose.model(cartCollection, cartSchema);
  
  module.exports = Cart;
  