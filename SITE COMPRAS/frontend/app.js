let token = '';

function register() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.userId) {
      alert('User registered successfully');
    } else {
      alert('Error registering user');
    }
  });
}

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.token) {
      token = data.token;
      document.getElementById('auth').style.display = 'none';
      document.getElementById('shopping-list').style.display = 'block';
      loadProducts();
    } else {
      alert('Error logging in');
    }
  });
}

function addProduct() {
  const name = document.getElementById('product-name').value;
  const price = parseFloat(document.getElementById('product-price').value);

  fetch('/products', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify({ name, price })
  })
  .then(response => response.json())
  .then(data => {
    if (data.productId) {
      loadProducts();
    } else {
      alert('Error adding product');
    }
  });
}

function loadProducts() {
  fetch('/products', {
    headers: {
      'Authorization': token
    }
  })
  .then(response => response.json())
  .then(products => {
    const productsList = document.getElementById('products');
    productsList.innerHTML = '';
    let total = 0;

    products.forEach(product => {
      total += product.price;
      const li = document.createElement('li');
      li.textContent = `${product.name} - $${product.price.toFixed(2)}`;
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = () => deleteProduct(product.id);
      li.appendChild(deleteButton);
      productsList.appendChild(li);
    });

    document.getElementById('total-price').textContent = total.toFixed(2);
  });
}

function deleteProduct(id) {
  fetch(`/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': token
    }
  })
  .then(() => {
    loadProducts();
  });
}
