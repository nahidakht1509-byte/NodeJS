const fs = require('fs').promises;
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'data', 'products.json');

async function readProducts() {
  const fileContent = await fs.readFile(dataFilePath, 'utf-8');
  const data = JSON.parse(fileContent || '{"products": []}');
  return data.products || [];
}

async function writeProducts(products) {
  await fs.writeFile(dataFilePath, JSON.stringify({ products }, null, 2));
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function calculateExpiryDate(category, manufacturingDate) {
  const expiryDate = new Date(manufacturingDate);
  const normalizedCategory = String(category).toLowerCase();

  switch (normalizedCategory) {
    case 'food':
      expiryDate.setDate(expiryDate.getDate() + 10);
      break;
    case 'electronics':
      expiryDate.setFullYear(expiryDate.getFullYear() + 2);
      break;
    case 'medicine':
      expiryDate.setMonth(expiryDate.getMonth() + 6);
      break;
    case 'cosmetics':
      expiryDate.setFullYear(expiryDate.getFullYear() + 3);
      break;
    default:
      expiryDate.setMonth(expiryDate.getMonth() + 1);
      break;
  }

  return formatDate(expiryDate);
}

function buildProductPayload(input, existingProduct = {}) {
  const manufacturingDate = existingProduct.manufacturingDate || formatDate(new Date());
  const product = {
    ...existingProduct,
    ...input,
    manufacturingDate
  };

  product.expiryDate = calculateExpiryDate(product.category, manufacturingDate);
  return product;
}

exports.addProduct = async (req, res) => {
  try {
    const { name, category, price } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({ message: 'name, category and price are required.' });
    }

    const products = await readProducts();
    const newProduct = buildProductPayload(req.body);
    newProduct.id = products.length ? Math.max(...products.map((product) => Number(product.id) || 0)) + 1 : 1;
    newProduct.price = Number(price);

    products.push(newProduct);
    await writeProducts(products);

    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to add product.', error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productId = Number(req.params.id);
    const products = await readProducts();
    const productIndex = products.findIndex((product) => Number(product.id) === productId);

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const updatedProduct = buildProductPayload(req.body, products[productIndex]);
    updatedProduct.id = products[productIndex].id;
    if (updatedProduct.price !== undefined) {
      updatedProduct.price = Number(updatedProduct.price);
    }

    products[productIndex] = updatedProduct;
    await writeProducts(products);

    return res.json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update product.', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = Number(req.params.id);
    const products = await readProducts();
    const filteredProducts = products.filter((product) => Number(product.id) !== productId);

    if (filteredProducts.length === products.length) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    await writeProducts(filteredProducts);
    return res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete product.', error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await readProducts();
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch products.', error: error.message });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await readProducts();
    const category = String(req.params.category).toLowerCase();
    const filteredProducts = products.filter((product) => String(product.category).toLowerCase() === category);

    return res.json(filteredProducts);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch products by category.', error: error.message });
  }
};
