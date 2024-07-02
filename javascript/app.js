
import Parse from '../node_modules/parse/dist/parse.min.js'; // ajuste o caminho conforme necessário

// Inicializa o Parse com as credenciais do seu aplicativo Back4App
Parse.initialize("QjHdnKmTtyV4ZiyXQrWXaN7fNKpxkFpj666ad8YM", "j25PWNRqvIa8pWjxoMwfEOBNVYNcRQxdHVhZPfiV");
Parse.serverURL = 'https://parseapi.back4app.com/';

document.addEventListener('DOMContentLoaded', function() {
  var menuBtn = document.querySelector('.menu-btn');
  if (menuBtn) {
    var menu = document.querySelector('.menu');
    menuBtn.addEventListener('click', function() {
      menu.classList.toggle('show');
    });
  }
});

// Função para adicionar produto à lista de compras
function adicionarProduto(nomeProduto, quantidade = 1, preco = 0, selecionado = false) {
  if (quantidade < 0 || preco < 0) {
    alert('Quantidade e preço devem ser valores positivos.');
    return;
  }

  const listaProdutos = document.getElementById('produtos').getElementsByTagName('tbody')[0];
  const linhas = listaProdutos.getElementsByTagName('tr');
  for (let i = 0; i < linhas.length; i++) {
    const nomeExistente = linhas[i].getElementsByTagName('td')[1].textContent;
    if (nomeExistente === nomeProduto) {
      alert('OPS: Este item já está na lista.');
      return;
    }
  }

  const novaLinha = listaProdutos.insertRow();

  const celulaCheckbox = novaLinha.insertCell(0);
  const celulaNome = novaLinha.insertCell(1);
  const celulaQuantidade = novaLinha.insertCell(2);
  const celulaPreco = novaLinha.insertCell(3);
  const celulaRemover = novaLinha.insertCell(4);

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.classList.add('checkbox');
  checkbox.checked = selecionado;
  checkbox.addEventListener('change', () => {
    atualizarPrecoSelecionado();
    salvarLista();
  });
  celulaCheckbox.appendChild(checkbox);

  celulaNome.textContent = nomeProduto;

  const inputQuantidade = document.createElement('input');
  inputQuantidade.type = 'number';
  inputQuantidade.placeholder = 'Qtd';
  inputQuantidade.value = quantidade;
  inputQuantidade.min = 0;  
  inputQuantidade.addEventListener('change', () => {
    if (inputQuantidade.value < 0) inputQuantidade.value = 0;
    atualizarPrecoTotal();
    salvarLista();
  });
  celulaQuantidade.appendChild(inputQuantidade);

  const inputPreco = document.createElement('input');
  inputPreco.type = 'number';
  inputPreco.placeholder = 'Preço';
  inputPreco.value = preco;
  inputPreco.min = 0;
  inputPreco.addEventListener('change', () => {
    if (inputPreco.value < 0) inputPreco.value = 0;
    atualizarPrecoTotal();
    salvarLista();
  });
  celulaPreco.appendChild(inputPreco);

  const btnRemover = document.createElement('button');
  const iconRemover = document.createElement('img');
  iconRemover.src = 'img/lixeira.png';
  iconRemover.alt = 'Remover';
  iconRemover.classList.add('remove-icon');
  btnRemover.appendChild(iconRemover);
  btnRemover.classList.add('btn-remover');
  btnRemover.addEventListener('click', () => {
    removerProduto(novaLinha);
    salvarLista();
    atualizarVisibilidadeElementos();
  });
  celulaRemover.appendChild(btnRemover);

  atualizarVisibilidadeElementos();
  salvarLista();
}

// Função para remover um produto da lista
function removerProduto(linha) {
  linha.remove();
  salvarLista();
  atualizarVisibilidadeElementos();
}

// Função para remover todos os produtos da lista
function removerTodosProdutos() {
  const tabelaBody = document.querySelector('#produtos tbody');
  tabelaBody.innerHTML = ''; 
  document.getElementById('preco-total').textContent = '0.00';
  document.getElementById('preco-selecionado').textContent = '0.00';
  salvarLista();
  atualizarVisibilidadeElementos();
}

// Função para atualizar a visibilidade da tabela, dos totais e do botão "Remover Tudo"
function atualizarVisibilidadeElementos() {
  const tabela = document.getElementById('produtos');
  const totals = document.querySelector('.totals');
  const btnRemoverTodos = document.getElementById('btn-remover-todos');
  const linhas = document.querySelectorAll('#produtos tbody tr');

  const temProdutos = linhas.length > 0;
  tabela.classList.toggle('hidden', !temProdutos);
  totals.classList.toggle('hidden', !temProdutos);
  btnRemoverTodos.classList.toggle('hidden', !temProdutos);
  document.querySelector('.totals').style.display = temProdutos ? 'block' : 'none';
}

// Função para atualizar o preço total
function atualizarPrecoTotal() {
  const linhas = document.querySelectorAll('#produtos tbody tr');
  let precoTotal = 0;

  linhas.forEach(linha => {
    const quantidade = parseFloat(linha.cells[2].querySelector('input').value);
    const preco = parseFloat(linha.cells[3].querySelector('input').value);
    if (!isNaN(quantidade) && !isNaN(preco)) {
      precoTotal += quantidade * preco;
    }
  });

  document.getElementById('preco-total').textContent = precoTotal.toFixed(2);
  atualizarPrecoSelecionado();
}

// Função para atualizar o preço dos itens selecionados
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

// Função para salvar a lista de produtos no Back4App
function salvarLista() {
  const linhas = document.querySelectorAll('#produtos tbody tr');
  const Produtos = Parse.Object.extend("_Product");

  // Remover todos os produtos existentes no banco antes de salvar novamente
  const query = new Parse.Query(Produtos);
  query.find().then((results) => {
    Parse.Object.destroyAll(results).then(() => {
      linhas.forEach(linha => {
        const produto = new Produtos();
        produto.set("nome", linha.cells[1].textContent);
        produto.set("quantidade", parseFloat(linha.cells[2].querySelector('input').value));
        produto.set("preco", parseFloat(linha.cells[3].querySelector('input').value));
        produto.set("selecionado", linha.cells[0].querySelector('input[type="checkbox"]').checked);
        produto.save();
      });
    });
  });
}

// Função para carregar a lista de produtos do Back4App
function carregarLista() {
  const Produtos = Parse.Object.extend("_Product");
  const query = new Parse.Query(Produtos);

  query.find().then((results) => {
    results.forEach((produto) => {
      adicionarProduto(produto.get("nome"), produto.get("quantidade"), produto.get("preco"), produto.get("selecionado"));
    });
    atualizarVisibilidadeElementos();
  });
}

// Carregar a lista de produtos ao carregar a página
window.addEventListener('load', carregarLista);

function adicionarItensColados() {
  const itensColados = document.getElementById('itens-colados').value.trim();
  if (itensColados) {
    const itens = itensColados.split('\n');
    itens.forEach(item => {
      const nomeProduto = item.trim();
      if (nomeProduto) {
        adicionarProduto(nomeProduto, 1, 0, false);
      }
    });
    atualizarPrecoTotal();
    document.getElementById('itens-colados').value = '';
  }
}

document.getElementById('btn-adicionar-colados').addEventListener('click', adicionarItensColados);
