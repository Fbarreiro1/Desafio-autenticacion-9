const mongoose = require('mongoose')
const paginate = require('mongoose-paginate-v2');
const productCollection = 'products'

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
	thumbnail: String,
	code: String,
	stock: Number,
	status: Boolean,
	category: String
})

productSchema.plugin(paginate);

const Product = mongoose.model(productCollection, productSchema)

module.exports = Product