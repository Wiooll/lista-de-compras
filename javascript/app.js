import Parse from 'parse';

// Substitua 'YOUR_APP_ID' e 'YOUR_JAVASCRIPT_KEY' com suas chaves do Back4App
Parse.initialize("QjHdnKmTtyV4ZiyXQrWXaN7fNKpxkFpj666ad8YM", "j25PWNRqvIa8pWjxoMwfEOBNVYNcRQxdHVhZPfiV");
Parse.serverURL = 'https://parseapi.back4app.com/';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const cadastroForm = document.getElementById('cadastro-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const username = document.getElementById('login-username').value;
      const password = document.getElementById('login-password').value;

      try {
        await Parse.User.logIn(username, password);
        window.location.href = 'index.html';
      } catch (error) {
        alert('Usuário ou senha inválidos');
      }
    });
  }

  if (cadastroForm) {
    cadastroForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const username = document.getElementById('cadastro-username').value;
      const password = document.getElementById('cadastro-password').value;

      const user = new Parse.User();
      user.set("username", username);
      user.set("password", password);

      try {
        await user.signUp();
        alert('Usuário cadastrado com sucesso!');
        window.location.href = 'login.html';
      } catch (error) {
        alert(`Erro ao cadastrar usuário: ${error.message}`);
      }
    });
  }

  carregarProdutos();
});

// Função para adicionar produto à lista de compras
function adicionarProduto(nomeProduto, quantidade = 1, preco = 0, selecionado = false) {
  const Produto = Parse.Object.extend('Produto');
  const produto = new Produto();

  produto.set('nome', nomeProduto);
  produto.set('quantidade', quantidade);
  produto.set('preco', preco);
  produto.set('selecionado', selecionado);

  produto.save().then(() => {
    carregarProdutos();
  });
}

// Função para carregar produtos do Parse
function carregarProdutos() {
  const Produto = Parse.Object.extend('Produto');
  const query = new Parse.Query(Produto);

  query.find().then((resultados) => {
    const listaProdutos = document.getElementById('produtos').getElementsByTagName('tbody')[0];
    listaProdutos.innerHTML = '';

    resultados.forEach((produto) => {
      const novaLinha = listaProdutos.insertRow();

      const celulaCheckbox = novaLinha.insertCell(0);
      const celulaNome = novaLinha.insertCell(1);
      const celulaQuantidade = novaLinha.insertCell(2);
      const celulaPreco = novaLinha.insertCell(3);
      const celulaRemover = novaLinha.insertCell(4);

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.classList.add('checkbox');
      checkbox.checked = produto.get('selecionado');
      checkbox.addEventListener('change', () => {
        produto.set('selecionado', checkbox.checked);
        produto.save();
        atualizarPrecoSelecionado();
      });
      celulaCheckbox.appendChild(checkbox);

      celulaNome.textContent = produto.get('nome');

      const inputQuantidade = document.createElement('input');
      inputQuantidade.type = 'number';
      inputQuantidade.placeholder = 'Qtd';
      inputQuantidade.value = produto.get('quantidade');
      inputQuantidade.addEventListener('change', () => {
        produto.set('quantidade', inputQuantidade.value);
        produto.save();
        atualizarPrecoTotal();
      });
      celulaQuantidade.appendChild(inputQuantidade);

      const inputPreco = document.createElement('input');
      inputPreco.type = 'number';
      inputPreco.placeholder = 'Preço';
      inputPreco.value = produto.get('preco');
      inputPreco.addEventListener('change', () => {
        produto.set('preco', inputPreco.value);
        produto.save();
        atualizarPrecoTotal();
      });
      celulaPreco.appendChild(inputPreco);

      const btnRemover = document.createElement('button');
      btnRemover.textContent = 'Remover';
      btnRemover.classList.add('btn-remover');
      btnRemover.addEventListener('click', () => {
        produto.destroy().then(() => {
          carregarProdutos();
        });
      });
      celulaRemover.appendChild(btnRemover);
    });

    atualizarPrecoTotal();
  });
}

function adicionarItensColados() {
  const itensColados = document.getElementById('itens-colados').value.trim();
  if (itensColados) {
    const itens = itensColados.split('\n');
    itens.forEach(item => {
      const nomeProduto = item.trim();
      if (nomeProduto) {
        adicionarProduto(nomeProduto);
      }
    });
    atualizarPrecoTotal();
    document.getElementById('itens-colados').value = '';
  }
}

function atualizarPrecoTotal() {
  const Produto = Parse.Object.extend('Produto');
  const query = new Parse.Query(Produto);

  query.find().then((resultados) => {
    let precoTotal = 0;
    resultados.forEach((produto) => {
      const quantidade = produto.get('quantidade');
      const preco = produto.get('preco');
      if (!isNaN(quantidade) && !isNaN(preco)) {
        precoTotal += quantidade * preco;
      }
    });

    document.getElementById('preco-total').textContent = precoTotal.toFixed(2);
    atualizarPrecoSelecionado();
  });
}

function atualizarPrecoSelecionado() {
  const checkboxes = document.querySelectorAll('#produtos tbody input[type="checkbox"]');
  let precoSelecionado = 0;

  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      const quantidade = parseFloat(checkbox.parentElement.nextElementSibling.nextElementSibling.querySelector('input').value);
      const preco = parseFloat(checkbox.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.querySelector('input').value);
      if (!isNaN(quantidade) && !isNaN(preco)) {
        precoSelecionado += quantidade * preco;
      }
    }
  });

  document.getElementById('preco-selecionado').textContent = precoSelecionado.toFixed(2);
}

function removerProduto(linha) {
  const Produto = Parse.Object.extend('Produto');
  const query = new Parse.Query(Produto);
  const nomeProduto = linha.cells[1].textContent;

  query.equalTo('nome', nomeProduto);
  query.first().then((produto) => {
    if (produto) {
      produto.destroy().then(() => {
        carregarProdutos();
      });
    }
  });
}

function removerTodosProdutos() {
  const Produto = Parse.Object.extend('Produto');
  const query = new Parse.Query(Produto);

  query.find().then((resultados) => {
    resultados.forEach((produto) => {
      produto.destroy();
    });
    carregarProdutos();
  });
}

// Função para salvar a lista de produtos no Local Storage
function salvarLista() {
  const linhas = document.querySelectorAll('#produtos tbody tr');
  const produtos = [];

  linhas.forEach(linha => {
    const produto = {
      nome: linha.cells[1].textContent,
      quantidade: linha.cells[2].querySelector('input').value,
      preco: linha.cells[3].querySelector('input').value,
      selecionado: linha.cells[0].querySelector('input[type="checkbox"]').checked
    };
    produtos.push(produto);
  });

  localStorage.setItem('listaProdutos', JSON.stringify(produtos));
}

// Função para carregar a lista de produtos do Local Storage
function carregarLista() {
  const produtos = JSON.parse(localStorage.getItem('listaProdutos')) || [];
  produtos.forEach(produto => {
    adicionarProduto(produto.nome, produto.quantidade, produto.preco, produto.selecionado);
  });
}

// Carregar a lista de produtos ao carregar a página
window.addEventListener('load', carregarProdutos);
