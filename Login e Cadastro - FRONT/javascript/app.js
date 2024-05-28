// app.js

// Função para mostrar o formulário de registro e esconder o de login
function showRegisterForm() {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('register-form').style.display = 'block';
}

// Função para mostrar o formulário de login e esconder o de registro
function showLoginForm() {
  document.getElementById('register-form').style.display = 'none';
  document.getElementById('login-form').style.display = 'block';
}

// Função para adicionar produto à lista de compras
function adicionarProduto() {
  const nomeProduto = document.getElementById('nome-produto').value;
  const precoProduto = parseFloat(document.getElementById('preco-produto').value);

  if (nomeProduto && !isNaN(precoProduto)) {
    const listaProdutos = document.getElementById('produtos');
    const novoProduto = document.createElement('li');
    novoProduto.textContent = `${nomeProduto} - R$ ${precoProduto.toFixed(2)}`;
    listaProdutos.appendChild(novoProduto);

    atualizarPrecoTotal(precoProduto);
  } else {
    alert('Por favor, insira um nome de produto e um preço válido.');
  }
}

// Função para atualizar o preço total
function atualizarPrecoTotal(precoProduto) {
  const precoTotalElem = document.getElementById('preco-total');
  const precoTotalAtual = parseFloat(precoTotalElem.textContent);
  const novoPrecoTotal = precoTotalAtual + precoProduto;
  precoTotalElem.textContent = novoPrecoTotal.toFixed(2);
}

// Event listeners para o envio dos formulários de login e registro
document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();
  // Lógica de autenticação aqui
  document.getElementById('auth').style.display = 'none';
  document.getElementById('lista-compras').style.display = 'block';
});

document.getElementById('register-form').addEventListener('submit', function(event) {
  event.preventDefault();
  // Lógica de registro aqui
  alert('Usuário registrado com sucesso!');
  showLoginForm();
});
