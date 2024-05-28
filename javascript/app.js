// app.js

// Função para adicionar produto à lista de compras
function adicionarProduto(nomeProduto) {
  const listaProdutos = document.getElementById('produtos').getElementsByTagName('tbody')[0];
  const novaLinha = listaProdutos.insertRow();

  const celulaCheckbox = novaLinha.insertCell(0);
  const celulaNome = novaLinha.insertCell(1);
  const celulaPreco = novaLinha.insertCell(2);
  const celulaRemover = novaLinha.insertCell(3);

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.classList.add('checkbox');
  checkbox.addEventListener('change', atualizarPrecoSelecionado);
  celulaCheckbox.appendChild(checkbox);

  celulaNome.textContent = nomeProduto;

  const inputPreco = document.createElement('input');
  inputPreco.type = 'number';
  inputPreco.placeholder = 'Preço';
  inputPreco.addEventListener('change', atualizarPrecoTotal);
  celulaPreco.appendChild(inputPreco);

  const btnRemover = document.createElement('button');
  btnRemover.textContent = 'Remover';
  btnRemover.addEventListener('click', () => removerProduto(novaLinha));
  celulaRemover.appendChild(btnRemover);
}

// Função para adicionar itens colados na lista de compras
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
    atualizarPrecoTotal(); // Atualiza o preço total após adicionar os itens colados
    document.getElementById('itens-colados').value = '';
  }
}

// Função para atualizar o preço total
function atualizarPrecoTotal() {
  const precos = document.querySelectorAll('#produtos tbody input[type="number"]');
  let precoTotal = 0;

  precos.forEach(input => {
    const preco = parseFloat(input.value);
    if (!isNaN(preco)) {
      precoTotal += preco;
    }
  });

  const precoTotalElem = document.getElementById('preco-total');
  precoTotalElem.textContent = precoTotal.toFixed(2);

  // Atualizar o preço dos itens selecionados
  atualizarPrecoSelecionado();
}

// Função para atualizar o preço dos itens selecionados
function atualizarPrecoSelecionado() {
  const checkboxes = document.querySelectorAll('#produtos tbody input[type="checkbox"]');
  let precoSelecionado = 0;

  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      const preco = parseFloat(checkbox.parentElement.nextElementSibling.nextElementSibling.querySelector('input').value);
      if (!isNaN(preco)) {
        precoSelecionado += preco;
      }
    }
  });

  const precoSelecionadoElem = document.getElementById('preco-selecionado');
  precoSelecionadoElem.textContent = precoSelecionado.toFixed(2);
}


// Função para remover um produto da lista
function removerProduto(linha) {
  const precoProduto = parseFloat(linha.cells[2].querySelector('input').value);
  if (!isNaN(precoProduto)) {
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
}
