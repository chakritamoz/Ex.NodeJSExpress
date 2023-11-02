// Manage express router
const express = require('express');
const router = express.Router();

// Import product model
const Product = require('../models/products.js');

// Import multer for upload file
const multer = require('multer');

// Setting storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images/products');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + ".jpg") //Change file name protect duplicate file name
  }
});

const upload = multer({
  storage: storage
});

router.get('/',async (req,res) => {
  try {
    const products = await Product.find();

    res.render('./pages/', {
      products: products
    });
  } catch(err) {
    console.log(err);
  }
});

router.get('/manage', async (req, res) => {
  try {
    const products = await Product.find();
    
    res.render('./pages/manage.ejs', {
      products: products
    });
  } catch(err) {
    console.log(err);
  }
});

router.get('/delete/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id, {
      useFindAndModify: false
    });

    res.redirect('/manage');
  } catch (err) {
    console.log(err);
  }

});

router.get('/modify/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    const doc = new Product({
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description
    });
    
    res.render('./pages/form.ejs', {
      product: {}
    });
  } catch(err) {
    res.render('./pages/404.ejs');
  }
});

router.get('/insert', (req, res) => {
  res.render('./pages/form.ejs', {
    product: {}
  });
});

router.post('/insert', upload.single("image"), async (req, res) => {
  const doc = new Product({
    name: req.body.name,
    price: req.body.price,
    image: req.file.filename,
    description: req.body.description
  });

  try {
    await Product.saveProduct(doc);
    res.redirect('/');
  } catch(err) {
    console.log(err);
  }
});

router.post('/edit', async(req, res) => {
  const prodId = req.body.prod_id;
  
  try {
    const product = await Product.findOne({_id: prodId});
    res.render('./pages/edit.ejs', {
      product: product
    });
  } catch(err) {
    console.log(err);
    res.render('./pages/404.ejs');
  }
});

router.post('/update', async (req, res) => {
  const prodId = req.body.prod_id;
  const product = {
    name: req.body.name,
    price: req.body.price,
    description: req.body.description
  }
  try {
    await Product.findByIdAndUpdate(prodId, product, {useFindAndModify: false});
    res.redirect('/manage')
  } catch(err) { 
    res.render('./pages/404.ejs');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({_id: req.params.id});
    res.render('./pages/product.ejs', {
      product: product
    });
  } catch(err) {
    console.log(err);
    res.render('/pages/404.ejs');
  }
});

module.exports = router;