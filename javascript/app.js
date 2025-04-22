// Função para controlar a exibição do menu quando o botão é clicado
document.addEventListener('DOMContentLoaded', function() {
  var menuBtn = document.querySelector('.menu-btn');
  var menu = document.querySelector('.menu');

  if (menuBtn) {
    menuBtn.addEventListener('click', function() {
      menu.classList.toggle('show');
    });
  }
});

// Função para mostrar notificações
function mostrarNotificacao(mensagem, tipo = 'sucesso') {
  const notificacao = document.createElement('div');
  notificacao.className = `notificacao ${tipo}`;
  notificacao.textContent = mensagem;
  document.body.appendChild(notificacao);

  // Remove a notificação após 3 segundos
  setTimeout(() => {
    notificacao.remove();
  }, 3000);
}

// Função para adicionar produto à lista de compras
function adicionarProduto(nomeProduto, quantidade = 1, preco = 0, selecionado = false) {
  // Verificar se a quantidade e o preço são valores positivos
  if (quantidade < 0 || preco < 0) {
    mostrarNotificacao('Quantidade e preço devem ser valores positivos.', 'erro');
    return;
  }

  // Verificação de item duplicado
  const listaProdutos = document.getElementById('produtos').getElementsByTagName('tbody')[0];
  const linhas = listaProdutos.getElementsByTagName('tr');
  for (let i = 0; i < linhas.length; i++) {
    const nomeExistente = linhas[i].getElementsByTagName('td')[1].textContent;
    if (nomeExistente === nomeProduto) {
      mostrarNotificacao('Este item já está na lista.', 'erro');
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
  inputQuantidade.min = 0;  // Impede valores negativos
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
  inputPreco.min = 0;  // Impede valores negativos
  inputPreco.addEventListener('change', () => {
    if (inputPreco.value < 0) inputPreco.value = 0;
    atualizarPrecoTotal();
    salvarLista();
  });
  celulaPreco.appendChild(inputPreco);

  const btnRemover = document.createElement('button');
  const iconRemover = document.createElement('img');
  iconRemover.src = 'img/lixeira.png'; // Certifique-se de que a imagem da lixeira está na pasta 'img'
  iconRemover.alt = 'Remover';
  iconRemover.classList.add('remove-icon');
  btnRemover.appendChild(iconRemover);
  btnRemover.classList.add('btn-remover');
  btnRemover.addEventListener('click', () => {
    removerProduto(novaLinha);
    salvarLista();
    atualizarVisibilidadeElementos(); // Atualiza a visibilidade dos elementos ao remover produto
  });
  celulaRemover.appendChild(btnRemover);

  atualizarVisibilidadeElementos(); // Atualiza a visibilidade dos elementos ao adicionar produto
  salvarLista(); // Salva a lista de produtos
  mostrarNotificacao(`${nomeProduto} foi adicionado à lista.`);
}

// Função para remover um produto da lista
function removerProduto(linha) {
  const nomeProduto = linha.cells[1].textContent;
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
  atualizarVisibilidadeElementos(); // Atualiza a visibilidade dos elementos ao remover produto
  mostrarNotificacao(`${nomeProduto} foi removido da lista.`);
}

// Função para remover todos os produtos da lista
function removerTodosProdutos() {
  if (confirm('Tem certeza que deseja remover todos os itens da lista?')) {
    const tabelaBody = document.querySelector('#produtos tbody');
    tabelaBody.innerHTML = ''; // Limpa o conteúdo da tabela
    document.getElementById('preco-total').textContent = '0.00';
    document.getElementById('preco-selecionado').textContent = '0.00';
    salvarLista(); // Salva a lista vazia
    atualizarVisibilidadeElementos(); // Atualiza a visibilidade dos elementos ao remover todos os produtos
    mostrarNotificacao('Todos os itens foram removidos da lista.');
  }
}

// Função para atualizar a visibilidade da tabela, dos totais e do botão "Remover Tudo"
function atualizarVisibilidadeElementos() {
  const tabela = document.getElementById('produtos');
  const totals = document.querySelector('.totals');
  const btnRemoverTodos = document.getElementById('btn-remover-todos');
  const linhas = document.querySelectorAll('#produtos tbody tr');

  const temProdutos = linhas.length > 0;
  console.log(`Tem produtos? ${temProdutos}`);
  
  tabela.classList.toggle('hidden', !temProdutos);
  totals.classList.toggle('hidden', !temProdutos);
  btnRemoverTodos.classList.toggle('hidden', !temProdutos);

  // Atualizar a visibilidade dos totais especificamente
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
  atualizarVisibilidadeElementos(); // Atualiza a visibilidade dos elementos ao carregar a página
}

// Carregar a lista de produtos ao carregar a página
window.addEventListener('load', carregarLista);

// Função para ordenar a lista de produtos
function ordenarLista(criterio = 'nome') {
  const tbody = document.querySelector('#produtos tbody');
  const linhas = Array.from(tbody.rows);

  linhas.sort((a, b) => {
    switch (criterio) {
      case 'nome':
        return a.cells[1].textContent.localeCompare(b.cells[1].textContent);
      case 'preco':
        const precoA = parseFloat(a.cells[3].querySelector('input').value) || 0;
        const precoB = parseFloat(b.cells[3].querySelector('input').value) || 0;
        return precoB - precoA;
      case 'quantidade':
        const qtdA = parseFloat(a.cells[2].querySelector('input').value) || 0;
        const qtdB = parseFloat(b.cells[2].querySelector('input').value) || 0;
        return qtdB - qtdA;
      default:
        return 0;
    }
  });

  // Limpa e readiciona as linhas ordenadas
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
  linhas.forEach(linha => tbody.appendChild(linha));
  salvarLista();
}

// Função para processar texto colado
function processarTextoColado(texto) {
  // Remove espaços extras e linhas vazias
  const linhas = texto.split('\n')
    .map(linha => linha.trim())
    .filter(linha => linha.length > 0);

  let itensProcessados = [];

  linhas.forEach(linha => {
    // Tenta diferentes formatos de entrada
    let item = {
      nome: '',
      quantidade: 1,
      preco: 0
    };

    // Formato: "2 Arroz R$ 10,90" ou "2 Arroz 10,90"
    const padrao1 = /^(\d+)\s+(.+?)(?:\s+R?\$?\s*(\d+[.,]\d{2}|\d+))?$/;
    // Formato: "Arroz - 2 un - R$ 10,90" ou "Arroz - 2 - 10,90"
    const padrao2 = /^(.+?)\s*-\s*(\d+)(?:\s*un)?(?:\s*-\s*R?\$?\s*(\d+[.,]\d{2}|\d+))?$/;
    // Formato: "Arroz R$ 10,90" ou "Arroz 10,90"
    const padrao3 = /^(.+?)(?:\s+R?\$?\s*(\d+[.,]\d{2}|\d+))?$/;

    let match;
    if (match = linha.match(padrao1)) {
      item.quantidade = parseInt(match[1]);
      item.nome = match[2];
      if (match[3]) item.preco = parseFloat(match[3].replace(',', '.'));
    } else if (match = linha.match(padrao2)) {
      item.nome = match[1];
      item.quantidade = parseInt(match[2]);
      if (match[3]) item.preco = parseFloat(match[3].replace(',', '.'));
    } else if (match = linha.match(padrao3)) {
      item.nome = match[1];
      if (match[2]) item.preco = parseFloat(match[2].replace(',', '.'));
    } else {
      item.nome = linha;
    }

    // Capitaliza a primeira letra de cada palavra do nome
    item.nome = item.nome
      .toLowerCase()
      .split(' ')
      .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
      .join(' ');

    itensProcessados.push(item);
  });

  return itensProcessados;
}

// Função para adicionar itens colados
function adicionarItensColados() {
  const textarea = document.getElementById('itens-colados');
  const texto = textarea.value;

  if (!texto.trim()) {
    mostrarNotificacao('Por favor, insira algum item na lista.', 'erro');
    return;
  }

  const itens = processarTextoColado(texto);
  let adicionados = 0;

  itens.forEach(item => {
    try {
      adicionarProduto(item.nome, item.quantidade, item.preco);
      adicionados++;
    } catch (erro) {
      console.error(`Erro ao adicionar item ${item.nome}:`, erro);
    }
  });

  if (adicionados > 0) {
    textarea.value = '';
    mostrarNotificacao(`${adicionados} ${adicionados === 1 ? 'item foi adicionado' : 'itens foram adicionados'} à lista.`);
    ordenarLista('nome');
  }
}

// Adicionar evento ao botão de adicionar itens colados
document.getElementById('btn-adicionar-colados').addEventListener('click', adicionarItensColados);

// Configurações padrão
let configuracoes = {
  tema: 'claro',
  moeda: 'BRL',
  ordenacaoPadrao: 'nome',
  salvarAutomatico: true
};

// Carregar configurações
function carregarConfiguracoes() {
  const configSalvas = localStorage.getItem('configuracoes');
  if (configSalvas) {
    configuracoes = JSON.parse(configSalvas);
    aplicarConfiguracoes();
  }
}

// Aplicar configurações
function aplicarConfiguracoes() {
  document.getElementById('tema').value = configuracoes.tema;
  document.getElementById('moeda').value = configuracoes.moeda;
  document.getElementById('ordenacao-padrao').value = configuracoes.ordenacaoPadrao;
  document.getElementById('salvar-automatico').checked = configuracoes.salvarAutomatico;
  mudarTema();
}

// Funções do menu
function toggleListas() {
  document.getElementById('modal-listas').classList.toggle('show');
}

function toggleConfiguracoes() {
  document.getElementById('modal-configuracoes').classList.toggle('show');
}

function toggleEstatisticas() {
  document.getElementById('modal-estatisticas').classList.toggle('show');
  atualizarEstatisticas();
}

// Função para controlar a exibição do modal Sobre
function toggleSobre() {
  document.getElementById('modal-sobre').classList.toggle('show');
}

function mostrarPrincipal() {
  const modais = document.querySelectorAll('.modal');
  modais.forEach(modal => modal.classList.remove('show'));
}

// Funções de configuração
function mudarTema() {
  configuracoes.tema = document.getElementById('tema').value;
  document.body.className = configuracoes.tema;
  salvarConfiguracoes();
}

function mudarMoeda() {
  configuracoes.moeda = document.getElementById('moeda').value;
  atualizarPrecoTotal();
  salvarConfiguracoes();
}

function mudarOrdenacaoPadrao() {
  configuracoes.ordenacaoPadrao = document.getElementById('ordenacao-padrao').value;
  ordenarLista(configuracoes.ordenacaoPadrao);
  salvarConfiguracoes();
}

function toggleSalvarAutomatico() {
  configuracoes.salvarAutomatico = document.getElementById('salvar-automatico').checked;
  salvarConfiguracoes();
}

function salvarConfiguracoes() {
  localStorage.setItem('configuracoes', JSON.stringify(configuracoes));
}

// Funções de lista
function criarNovaLista() {
  const nome = document.getElementById('nova-lista').value.trim();
  if (!nome) {
    mostrarNotificacao('Digite um nome para a lista', 'erro');
    return;
  }

  const lista = {
    id: Date.now(),
    nome: nome,
    itens: obterItensAtuais(),
    data: new Date().toISOString()
  };

  salvarLista(lista);
  document.getElementById('nova-lista').value = '';
  atualizarListasSalvas();
  mostrarNotificacao('Lista criada com sucesso');
}

function obterItensAtuais() {
  const linhas = document.querySelectorAll('#produtos tbody tr');
  return Array.from(linhas).map(linha => ({
    nome: linha.cells[1].textContent,
    quantidade: linha.cells[2].querySelector('input').value,
    preco: linha.cells[3].querySelector('input').value,
    selecionado: linha.cells[0].querySelector('input').checked
  }));
}

function carregarLista(id) {
  const listas = JSON.parse(localStorage.getItem('listas')) || [];
  const lista = listas.find(l => l.id === id);
  if (lista) {
    limparListaAtual();
    lista.itens.forEach(item => {
      adicionarProduto(item.nome, item.quantidade, item.preco, item.selecionado);
    });
    mostrarNotificacao(`Lista "${lista.nome}" carregada`);
    toggleListas();
  }
}

function excluirLista(id) {
  if (!confirm('Tem certeza que deseja excluir esta lista?')) return;

  const listas = JSON.parse(localStorage.getItem('listas')) || [];
  const novasListas = listas.filter(l => l.id !== id);
  localStorage.setItem('listas', JSON.stringify(novasListas));
  atualizarListasSalvas();
  mostrarNotificacao('Lista excluída com sucesso');
}

function atualizarListasSalvas() {
  const container = document.getElementById('listas-salvas');
  const listas = JSON.parse(localStorage.getItem('listas')) || [];
  
  container.innerHTML = listas.map(lista => `
    <div class="lista-item">
      <div class="lista-info">
        <strong>${lista.nome}</strong>
        <small>${new Date(lista.data).toLocaleDateString()}</small>
      </div>
      <div class="lista-item-acoes">
        <button onclick="carregarLista(${lista.id})" title="Carregar lista">
          <i class="fas fa-folder-open"></i>
        </button>
        <button onclick="excluirLista(${lista.id})" title="Excluir lista">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
}

// Funções de estatísticas
function atualizarEstatisticas() {
  const listas = JSON.parse(localStorage.getItem('listas')) || [];
  
  // Total gasto
  const totalGasto = listas.reduce((total, lista) => {
    return total + lista.itens.reduce((subtotal, item) => {
      return subtotal + (item.quantidade * item.preco);
    }, 0);
  }, 0);
  
  document.getElementById('total-gasto').textContent = 
    formatarMoeda(totalGasto);

  // Média por lista
  const mediaLista = listas.length ? totalGasto / listas.length : 0;
  document.getElementById('media-lista').textContent = 
    formatarMoeda(mediaLista);

  // Itens mais frequentes
  const frequencia = {};
  listas.forEach(lista => {
    lista.itens.forEach(item => {
      frequencia[item.nome] = (frequencia[item.nome] || 0) + 1;
    });
  });

  const itensMaisFrequentes = Object.entries(frequencia)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([nome, freq]) => `<div>${nome} (${freq}x)</div>`)
    .join('');

  document.getElementById('itens-frequentes').innerHTML = itensMaisFrequentes;
}

// Função para compartilhar lista
function compartilharLista() {
  const itens = obterItensAtuais();
  const texto = itens.map(item => 
    `${item.quantidade}x ${item.nome} - ${formatarMoeda(item.preco)}`
  ).join('\\n');

  if (navigator.share) {
    navigator.share({
      title: 'Minha Lista de Compras',
      text: texto
    }).catch(console.error);
  } else {
    navigator.clipboard.writeText(texto)
      .then(() => mostrarNotificacao('Lista copiada para a área de transferência'))
      .catch(() => mostrarNotificacao('Erro ao copiar lista', 'erro'));
  }
}

// Função para formatar moeda
function formatarMoeda(valor) {
  const formatadores = {
    BRL: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }),
    USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
    EUR: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })
  };

  return formatadores[configuracoes.moeda].format(valor);
}

// Carregar configurações ao iniciar
window.addEventListener('load', () => {
  carregarConfiguracoes();
  carregarLista();
  atualizarListasSalvas();
});

// Fechar modais ao clicar fora
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('show');
  }
});
