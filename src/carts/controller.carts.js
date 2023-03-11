const { Router } = require('express')
const mongoose = require('mongoose')
const CartDao = require('../dao/Cart.dao')
const Cart = new CartDao()
const ProductDao = require('../dao/Product.dao')
const Product = new ProductDao()

const router = Router()

router.get('/', async (req, res) => {
  try {
    
    const carts = await Cart.find()
    console.log(carts)
  res.json(carts)
  }
  catch (error) {
    console.log(error)
    res.status(400).json({ error })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id} = req.params;
    const cart = await Cart.findById(id);
    console.log("el cart es",cart)
    res.render('cart', { cart,style: "cart.css" });

  //res.json(cart)
  }
  catch (error) {
    console.log(error)
    res.status(400).json({ error })
  }
})

router.post('/', async (req, res) => {
    try {
      const { products } = req.body;
  
      const newCart = {
        products,
      };
  
      const response = await Cart.create(newCart);
  
      res.json({ message: response });
    } catch (error) {
      res.status(400).json({ error });
    }
  });

  
router.post('/:cartId/products/:productId', async (req, res) => {
    try {
      const { cartId, productId } = req.params;
      const { quantity } = req.body;
     
      const cart = await Cart.findById(cartId.toString());
      
      const product = await Product.findById(productId);
      
      if (!cart) {
        throw new Error(`Cart with ID ${cartId} not found`);
      }
  
      if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
      }
      console.log(cart.products)
      const existingProductIndex = cart.products.findIndex(
        p => p.product_id.toString() === productId
      );
  
      if (existingProductIndex >= 0) {
        // If the product already exists in the cart, update its quantity
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        // Otherwise, add the new product to the cart
        cart.products.push({
          product_id: productId,
          quantity
        });
      }
  
      await cart.save();
  
      res.json(cart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  router.put('/:cid/products/:pid', async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { product_id,quantity } = req.body;
      
      const cart = await Cart.findById(cid);
      if (!cart) {
        throw new Error(`Cart with ID ${cid} not found`);
      }
      
      const product = cart.products.find(p => p.product_id.toString() === pid);
      if (!product) {
        throw new Error(`Product with ID ${pid} not found in cart`);
      }
      
      product.quantity += quantity;
  
      await cart.save();
  
      res.status(200).json({ message: 'Cart updated successfully', cart });
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: error.message });
    }
  });

  router.put('/:cid', async (req, res) => {
    try {
      const { cid } = req.params;
      const { products } = req.body;
      console.log("el id del cart",cid)
      console.log("el array de products",products)
      const cart = await Cart.findById(cid);
      if (!cart) {
        throw new Error(`Cart with ID ${cid} not found`);
      }
  
      for (const product of products) {
        const { product_id, quantity } = product;
        const cartProduct = cart.products.find(p => p.product_id.toString() === product_id);
        if (cartProduct) {
          cartProduct.quantity = quantity;
        } else {
          cart.products.push({ product_id, quantity });
        }
      }
  
      await cart.save();
  
      res.status(200).json({ message: 'Cart updated successfully', cart });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  });
  
  
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params
  
      if (id) {
        const cart = await Cart.findOneAndDelete(id)
  
        if (!cart) {
          throw new Error(`Product with ID ${id} not found`)
        }
  
        res.json(cart)
      } else {
        throw new Error('No ID parameter provided')
      }
    } catch (error) {
      res.status(404).json({ error: error.message })
    }
  })

  router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex(product => product.product_id.toString() === req.params.pid);

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    cart.products.splice(productIndex, 1);
    await cart.save();

    res.json({ message: 'Product removed from cart' });
  } catch (error) {
    res.status(400).json({ error });
  }
});


module.exports = router