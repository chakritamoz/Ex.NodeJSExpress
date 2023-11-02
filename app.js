const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const router = require('./routes/product.js');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(router);
app.use(express.static(path.join(__dirname, 'public')));

const port = 8080;
app.listen(port, () => {
  console.log(`Start server at port ${port}`);
});