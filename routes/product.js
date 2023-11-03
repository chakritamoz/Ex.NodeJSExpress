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
      products: products,
      title: "Home"
    });
  } catch(err) {
    console.log(err);
  }
});

router.get('/manage', async (req, res) => {
  if (req.cookies.signedin) {
    try {
      const products = await Product.find();
      
      res.render('./pages/manage.ejs', {
        products: products,
        title: "Managment"
      });
    } catch(err) {
      console.log(err);
    }
  } else {
    res.redirect('/signin');
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

router.get('/insert', (req, res) => {
  if (req.cookies.signedin) {
    res.render('./pages/form.ejs', {
      ttile: "Add Product"
    });
  } else {
    res.redirect('/signin');
  }
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
      product: product,
      title: "Edit Product"
    });
  } catch(err) {
    console.log(err);
    res.render('./pages/404.ejs', {title: "404 Not Found"});
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
    res.redirect('/manage');
  } catch(err) { 
    res.render('./pages/404.ejs', {title: "404 Not Found"});
  }
});

router.get('/signin', (req, res) => {
  res.render('./pages/signin.ejs', {
    title: "Sign In"
  });
});

router.post('/signin', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const limitTime = 10000;

  if (username === "admin" && password === "1234") {
    res.cookie("username", username, {maxAge: limitTime});
    res.cookie("password", password, {maxAge: limitTime});
    res.cookie("signedin", true, {maxAge: limitTime});
    res.redirect('/manage');
  } else {
    res.render()
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({_id: req.params.id});
    res.render('./pages/product.ejs', {
      product: product,
      title: "Product Details"
    });
  } catch(err) {
    console.log(err);
    res.render('./pages/404.ejs');
  }
});

module.exports = router;