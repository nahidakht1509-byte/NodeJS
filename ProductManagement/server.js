const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/products', productRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Product Management API is running',
    endpoints: [
      'POST /products',
      'PUT /products/:id',
      'DELETE /products/:id',
      'GET /products',
      'GET /products/category/:category'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

