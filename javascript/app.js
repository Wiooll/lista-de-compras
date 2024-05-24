// Função para adicionar produto à lista de compras
function adicionarProduto(nomeProduto, quantidade = 1, preco = 0, selecionado = false) {
  const listaProdutos = document.getElementById('produtos').getElementsByTagName('tbody')[0];
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
  inputQuantidade.addEventListener('change', () => {
    atualizarPrecoTotal();
    salvarLista();
  });
  celulaQuantidade.appendChild(inputQuantidade);

  const inputPreco = document.createElement('input');
  inputPreco.type = 'number';
  inputPreco.placeholder = 'Preço';
  inputPreco.value = preco;
  inputPreco.addEventListener('change', () => {
    atualizarPrecoTotal();
    salvarLista();
  });
  celulaPreco.appendChild(inputPreco);

  const btnRemover = document.createElement('button');
  const iconRemover = document.createElement('img');
  iconRemover.src = 'img/lixeira.png'; // Certifique-se de que a imagem da lixeira está na pasta 'images'
  iconRemover.alt = 'Remover';
  iconRemover.classList.add('remove-icon');
  btnRemover.appendChild(iconRemover);
  btnRemover.classList.add('btn-remover');
  btnRemover.addEventListener('click', () => {
    removerProduto(novaLinha);
    salvarLista();
    atualizarVisibilidadeRemoverTodos(); // Atualiza a visibilidade do botão ao remover produto
  });
  celulaRemover.appendChild(btnRemover);

  atualizarVisibilidadeRemoverTodos(); // Atualiza a visibilidade do botão ao adicionar produto
  salvarLista(); // Salva a lista de produtos
}

// Função para remover um produto da lista
function removerProduto(linha) {
  const quantidade = parseFloat(linha.cells[2].querySelector('input').value);
  const preco = parseFloat(linha.cells[3].querySelector('input').value);
  if (!isNaN(quantidade) && !isNaN(preco)) {
    const precoProduto = quantidade * preco;
    const precoTotalElem = document.getElementById('preco-total');
    const precoTotalAtual = parseFloat(precoTotalElem.textContent);
    precoTotalElem.textContent = (precoTotalAtual - precoProduto).toFixed(2);

    const checkbox = linha.cells[0].querySelector('.checkbox');
    if (checkbox.checked) {
      const precoSelecionadoElem = document.getElementById('preco-selecionado');
      const precoSelecionadoAtual = parseFloat(precoSelecionadoElem.textContent);
      precoSelecionadoElem.textContent = (precoSelecionadoAtual - precoProduto).toFixed(2);
    }
  }
  linha.remove();
  salvarLista(); // Salva a lista de produtos após remover
}

// Função para remover todos os produtos da lista
function removerTodosProdutos() {
  const tabelaBody = document.querySelector('#produtos tbody');
  tabelaBody.innerHTML = ''; // Limpa o conteúdo da tabela
  document.getElementById('preco-total').textContent = '0.00';
  document.getElementById('preco-selecionado').textContent = '0.00';
  salvarLista(); // Salva a lista vazia
}

// Função para atualizar a visibilidade do botão "Remover Todos"
function atualizarVisibilidadeRemoverTodos() {
  const btnRemoverTodos = document.getElementById('btn-remover-todos');
  const linhas = document.querySelectorAll('#produtos tbody tr');
  btnRemoverTodos.style.display = linhas.length > 0 ? 'block' : 'none';
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
  atualizarVisibilidadeRemoverTodos(); // Atualiza a visibilidade do botão ao carregar a página
}

// Carregar a lista de produtos ao carregar a página
window.addEventListener('load', carregarLista);

// Adicionar itens colados à lista de compras
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

// Adicionar evento ao botão de adicionar itens colados
document.getElementById('btn-adicionar-colados').addEventListener('click', adicionarItensColados);
