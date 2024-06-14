document.addEventListener('DOMContentLoaded', function() {
    var menuBtn = document.querySelector('.menu-btn');
    var menu = document.querySelector('.menu');

    menuBtn.addEventListener('click', function() {
        menu.classList.toggle('show');
    });
});

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
    salvarLista();
    atualizarVisibilidadeElementos();
}

function removerTodosProdutos() {
    const tabelaBody = document.querySelector('#produtos tbody');
    tabelaBody.innerHTML = '';
    document.getElementById('preco-total').textContent = '0.00';
    document.getElementById('preco-selecionado').textContent = '0.00';
    salvarLista();
    atualizarVisibilidadeElementos();
}

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

    document.querySelector('.totals').style.display = temProdutos ? 'block' : 'none';
}

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

function carregarLista() {
    const produtos = JSON.parse(localStorage.getItem('listaProdutos')) || [];
    produtos.forEach(produto => {
        adicionarProduto(produto.nome, produto.quantidade, produto.preco, produto.selecionado);
    });
    atualizarVisibilidadeElementos();
}

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

function incrementQuantity() {
    const quantityInput = document.getElementById('quantidade');
    let currentValue = parseInt(quantityInput.value);
    quantityInput.value = currentValue + 1;
}

function decrementQuantity() {
    const quantityInput = document.getElementById('quantidade');
    let currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
    }
}

function openCart() {
    alert('Carrinho de compras aberto!');
}
