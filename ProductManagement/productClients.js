const readline = require('readline');

const BASE_URL = 'http://localhost:3001/products';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const contentType = response.headers.get('content-type') || '';
  const result = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof result === 'object' && result !== null
      ? result.message
      : result;
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return result;
}

function showProducts(products) {
  if (!Array.isArray(products) || products.length === 0) {
    console.log('No products found.');
    return;
  }

  console.table(products);
}

async function createProduct() {
  const name = await ask('Enter product name: ');
  const category = await ask('Enter category: ');
  const price = Number(await ask('Enter price: '));

  const createdProduct = await request(BASE_URL, {
    method: 'POST',
    body: JSON.stringify({ name, category, price })
  });

  console.log('Product added successfully:');
  console.table([createdProduct]);
}

async function readProducts() {
  const readChoice = await ask('1. View all products\n2. View products by category\nChoose an option: ');

  if (readChoice === '2') {
    const category = await ask('Enter category: ');
    const products = await request(`${BASE_URL}/category/${encodeURIComponent(category)}`);
    showProducts(products);
    return;
  }

  const products = await request(BASE_URL);
  showProducts(products);
}

async function updateProduct() {
  const id = await ask('Enter product ID to update: ');
  const name = await ask('Enter new name (leave blank to keep current): ');
  const category = await ask('Enter new category (leave blank to keep current): ');
  const priceInput = await ask('Enter new price (leave blank to keep current): ');

  const updatedFields = {};

  if (name) {
    updatedFields.name = name;
  }

  if (category) {
    updatedFields.category = category;
  }

  if (priceInput) {
    updatedFields.price = Number(priceInput);
  }

  const updatedProduct = await request(`${BASE_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updatedFields)
  });

  console.log('Product updated successfully:');
  console.table([updatedProduct]);
}

async function deleteProduct() {
  const id = await ask('Enter product ID to delete: ');
  const response = await request(`${BASE_URL}/${id}`, { method: 'DELETE' });

  console.log(response.message);
}

function showMenu() {
  console.log('\nProduct Management Menu');
  console.log('1. Create product');
  console.log('2. Read products');
  console.log('3. Update product');
  console.log('4. Delete product');
  console.log('5. Exit');
}

async function runMenu() {
  let shouldExit = false;

  while (!shouldExit) {
    showMenu();
    const choice = await ask('Choose an option: ');

    try {
      switch (choice) {
        case '1':
          await createProduct();
          break;
        case '2':
          await readProducts();
          break;
        case '3':
          await updateProduct();
          break;
        case '4':
          await deleteProduct();
          break;
        case '5':
          shouldExit = true;
          console.log('Goodbye.');
          break;
        default:
          console.log('Invalid option. Please choose between 1 and 5.');
          break;
      }
    } catch (error) {
      console.error('Operation failed:', error.message);
    }
  }
}

runMenu()
  .catch((error) => {
    console.error('Client failed:', error.message);
  })
  .finally(() => {
    rl.close();
  });
