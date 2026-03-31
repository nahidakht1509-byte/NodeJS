const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.post('/', productController.addProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/', productController.getAllProducts);
router.get('/category/:category', productController.getProductsByCategory);

module.exports = router;

