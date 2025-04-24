import { useState } from 'react';

const InputArea = ({ onAddItem }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Processa diferentes formatos de entrada
    const match = input.match(/^(.*?)\s*(?:(\d+)\s*x\s*)?(?:R?\$?\s*(\d+(?:[,.]\d{1,2})?))?\s*$/i);
    if (!match) return;

    const [, name, quantity, price] = match;
    const newItem = {
      id: Date.now(),
      name: name.trim(),
      quantity: quantity ? parseInt(quantity) : 1,
      price: price ? parseFloat(price.replace(',', '.')) : 0,
      checked: false
    };

    onAddItem(newItem);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md dark:bg-gray-800">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Item, quantidade x preço (ex: Arroz 2x R$15,90)"
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Adicionar
        </button>
      </div>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Formatos aceitos: "Item", "Item 2x", "Item R$10,90", "Item 2x R$10,90"
      </p>
    </form>
  );
};

export default InputArea; 