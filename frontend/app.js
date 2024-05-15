let token = '';

function registrar() {
  const username = document.getElementById('username').value;
  const senha = document.getElementById('senha').value;

  fetch('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, senha })
  })
  .then(response => response.json())
  .then(data => {
    if (data.userId) {
      alert('Usuário registrado com sucesso');
    } else {
      alert('Erro ao registrar usuário');
    }
  });
}

function login() {
  const username = document.getElementById('username').value;
  const senha = document.getElementById('senha').value;

  fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, senha })
  })
  .then(response => response.json())
  .then(data => {
    if (data.token) {
      token = data.token;
      document.getElementById('auth').style.display = 'none';
      document.getElementById('lista-compras').style.display = 'block';
      carregarProdutos();
    } else {
      alert('Erro ao fazer login');
    }
  });
}

function adicionarProduto() {
  const nome = document.getElementById('nome-produto').value;
  const preco = parseFloat(document.getElementById('preco-produto').value);

  fetch('/produtos', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify({ nome, preco })
  })
  .then(response => response.json())
  .then(data => {
    if (data.productId) {
      carregarProdutos();
    } else {
      alert('Erro ao adicionar produto');
    }
  });
}

function carregarProdutos() {
  fetch('/produtos', {
    headers: {
      'Authorization': token
    }
  })
  .then(response => response.json())
  .then(produtos => {
    const produtosList = document.getElementById('produtos');
    produtosList.innerHTML = '';
    let total = 0;

    produtos.forEach(produto => {
      total += produto.preco;
      const li = document.createElement('li');
      li.textContent = `${produto.nome} - R$ ${produto.preco.toFixed(2)}`;
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Deletar';
      deleteButton.onclick = () => deletarProduto(produto.id);
      li.appendChild(deleteButton);
      produtosList.appendChild(li);
    });

    document.getElementById('preco-total').textContent = total.toFixed(2);
  });
}

function deletarProduto(id) {
  fetch(`/produtos/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': token
    }
  })
  .then(() => {
    carregarProdutos();
  });
}
