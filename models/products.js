// Call Mongoose
const mongoose = require('mongoose');

// Connect to MongoDB
const username = encodeURIComponent('chakritamoz');
const password = encodeURIComponent('Ch@kr1t@m0z0');
const cluster = encodeURIComponent('cluster0.vc2z3cl.mongodb.net');
const connectUrl = `mongodb+srv://${username}:${password}@${cluster}/MyDB?retryWrites=true&w=majority`;

mongoose.connect(connectUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(console.log(`Connected to mongodb.`))
.catch(err => {console.log(err)});

// Design Schema
const productSchema = mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String
});

// Create Model
const Product = mongoose.model('products', productSchema);

// Exports Model
module.exports = Product;

// Create Save Method Product
module.exports.saveProduct = function(model, doc) {
  model.save(doc)
}