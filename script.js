document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");
    const produtoInput = document.getElementById("produto");
    const precoInput = document.getElementById("preco");
    const lista = document.getElementById("lista");
    const total = document.getElementById("total");

    let produtos = [];

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const produto = produtoInput.value;
        const preco = parseFloat(precoInput.value);
        
        if (produto && !isNaN(preco)) {
            const item = { produto, preco };
            produtos.push(item);
            adicionarItemNaLista(item);
            atualizarTotal();
            produtoInput.value = "";
            precoInput.value = "";
        }
    });

    function adicionarItemNaLista(item) {
        const li = document.createElement("li");
        li.textContent = `${item.produto} - R$${item.preco.toFixed(2)}`;
        lista.appendChild(li);
    }

    function atualizarTotal() {
        const totalValor = produtos.reduce((acc, item) => acc + item.preco, 0);
        total.textContent = `Total: R$${totalValor.toFixed(2)}`;
    }
});
