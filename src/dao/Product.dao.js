const Product = require("./models/Product.model")

class ProductDao {
  async paginate(req,query,page,limit,sort) {
    try {
      
      const options = {
        page,
        limit,
        sort, lean: true,
      };
      
      const { docs, totalDocs, totalPages, hasNextPage, hasPrevPage, nextPage, prevPage } = await Product.paginate(query, { page, limit, sort,lean:true });
      
    const response = {
      status: "success",
      payload: docs,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage ? `${req.baseUrl}?limit=${limit}&page=${prevPage}&sort=${encodeURIComponent(JSON.stringify(sort))}&q=${encodeURIComponent(JSON.stringify(query))}` : null,
      nextLink: hasNextPage ? `${req.baseUrl}?limit=${limit}&page=${nextPage}&sort=${encodeURIComponent(JSON.stringify(sort))}&q=${encodeURIComponent(JSON.stringify(query))}` : null,

    };

  
      return response
    } catch (error) {
      console.log(error)
      res.status(400).json({ error });
    }
  }

  async find() {
    try {
      const products = await Product.find()
      return products
    } catch (error) {
      return error
    }
  }

  async findById(id) {
    try {
      const product = await Product.findById(id)
      return product
    } catch (error) {
      return error
    }
  }

  async findOneAndDelete(id) {
    try {
      const product = await Product.findOneAndDelete({ _id: id.toString() })
      return product
    } catch (error) {
      return error
    }
  }

  async findOneAndUpdate(id,body) {
    try {
      const product = await Product.findOneAndUpdate({ _id: id.toString() }, body)
      return product
    } catch (error) {
      return error
    }
  }

  async create(newProduct) {
    try {
      const response = await Product.create(newProduct)
      return response
    } catch (error) {
      return error
    }
  }

  async deleteMany() {
    try {
      await Product.deleteMany()
      return 'Productos eliminados'
    } catch (error) {
      return error
    }
  }

  async insertMany(products) {
    try {
      await Product.insertMany(products)
      return 'Productos agregados'
    } catch (error) {
      return error
    }
  }
}

module.exports = ProductDao