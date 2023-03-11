const { Router } = require('express')
const FilesManager = require('../dao/files.dao')
const ProductsManager = new FilesManager('Products.json')
const ProductDao = require('../dao/Product.dao')
const Product = new ProductDao()


const router = Router()

router.get('/', async (req, res) => {
  try {
    const {user} = req.session
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const query = req.query.q ? JSON.parse(req.query.q) : {};
    const sort = req.query.sort || {};
    const products = await Product.paginate(req,query,page,limit,sort)
   
    res.render('products', { products,style: "products.css",user });
  //res.json(products)
  }
  catch (error) {
    res.status(400).json({ error })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
       
      const product = await Product.findById( id );
      
      if (product.length == 0) {
        
        res.json({ message: `Product with ID ${id} not found` })
      }

      res.json(product)
    
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.post('/', async (req, res) => {
  try {
    const { title, description, price, thumbnail, code, stock, status, category } = req.body

    const newProduct = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category
    }
    const response = await Product.create(newProduct)
    

    res.json({ message: response })
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.post('/many', async (req, res) => {
  try {
    const products = await ProductsManager.loadItems()
    
    const newProducts = await Product.insertMany(products);
    console.log("los nuevos products", newProducts)
    res.json({ message: newProducts });
  } catch (error) {
    console.log(error)
    res.status(400).json({ error });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const product = await Product.findOneAndUpdate(id, req.body)

    if (!product) {
      throw new Error(`Product with ID ${id} not found`)
    }

    res.json(product)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    if (id) {
      const product = await Product.findOneAndDelete(id)

      if (!product) {
        throw new Error(`Product with ID ${id} not found`)
      }

      res.json(product)
    } else {
      throw new Error('No ID parameter provided')
    }
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

module.exports = router