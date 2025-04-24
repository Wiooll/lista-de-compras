# 🛒 ListaÊ - Refatoração para React + Vite + TailwindCSS

Este projeto é uma refatoração de um app de lista de compras inicialmente criado com HTML, CSS e JavaScript puro. O objetivo é modernizar a aplicação utilizando **React 18**, **Vite** e **TailwindCSS**, mantendo as funcionalidades originais e tornando o código mais modular e escalável.

---

## ⚙️ Tecnologias Utilizadas

- **Framework:** React 18
- **Build Tool:** Vite
- **Estilização:** TailwindCSS
- **Gerenciamento de Estado:** React Hooks (useState, useEffect)
- **Funcionalidades Extras:** PWA (Progressive Web App), localStorage, dark mode, drag-and-drop

---

## 🧩 Estrutura do Projeto Antigo

- `index.html` – Estrutura completa da interface
- `style.css` – Tema claro/escuro, tabelas, responsividade
- `app.js` – Lógica da aplicação (adicionar/remover itens, salvar, ordenar, modais etc.)

---

## 🎯 Objetivos da Refatoração

1. **Criar um novo projeto React com Vite**
2. **Modularizar a aplicação em componentes React**
3. **Migrar estilos para TailwindCSS**
4. **Manter todas as funcionalidades existentes:**
   - Adição de itens com múltiplos formatos de entrada
   - Edição inline de quantidade e preço
   - Cálculo automático de totais e itens selecionados
   - Ordenação da lista por nome, preço ou quantidade
   - Temas claro/escuro
   - Modais para configurações, estatísticas, sobre etc.
   - Salvar e carregar listas no `localStorage`
   - Menu flutuante responsivo
   - Suporte a PWA

---

## 🧱 Estrutura Esperada em React
src/ ├── components/ │ ├── Header.jsx │ ├── InputArea.jsx │ ├── ProductTable.jsx │ ├── TotalInfo.jsx │ ├── FloatingMenu.jsx │ ├── Modal.jsx │ └── Notificacao.jsx ├── App.jsx ├── main.jsx └── index.css
