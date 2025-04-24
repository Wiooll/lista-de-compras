const ProductTable = ({ items, onToggleItem, onUpdateItem, onDeleteItem, sortBy }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > 0) {
      onUpdateItem(id, { quantity: newQuantity });
    }
  };

  const handlePriceChange = (id, newPrice) => {
    const price = parseFloat(newPrice.replace(',', '.'));
    if (!isNaN(price) && price >= 0) {
      onUpdateItem(id, { price });
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="w-12 px-4 py-2">
              <span className="sr-only">Status</span>
            </th>
            <th className="px-4 py-2 text-left">
              <button
                onClick={() => sortBy('name')}
                className="font-semibold hover:text-blue-600 dark:hover:text-blue-400"
              >
                Item
              </button>
            </th>
            <th className="px-4 py-2 text-left">
              <button
                onClick={() => sortBy('quantity')}
                className="font-semibold hover:text-blue-600 dark:hover:text-blue-400"
              >
                Qtd
              </button>
            </th>
            <th className="px-4 py-2 text-left">
              <button
                onClick={() => sortBy('price')}
                className="font-semibold hover:text-blue-600 dark:hover:text-blue-400"
              >
                Preço
              </button>
            </th>
            <th className="px-4 py-2 text-right">Total</th>
            <th className="w-12 px-4 py-2">
              <span className="sr-only">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className={`border-t dark:border-gray-700 ${
                item.checked ? 'bg-gray-50 dark:bg-gray-900' : ''
              }`}
            >
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => onToggleItem(item.id)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
              <td className="px-4 py-2">
                <span className={item.checked ? 'line-through text-gray-500' : ''}>
                  {item.name}
                </span>
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                  className="w-20 px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                  min="1"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  value={item.price.toString().replace('.', ',')}
                  onChange={(e) => handlePriceChange(item.id, e.target.value)}
                  className="w-24 px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </td>
              <td className="px-4 py-2 text-right">
                {formatPrice(item.price * item.quantity)}
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="text-red-600 hover:text-red-800 dark:hover:text-red-400"
                  aria-label="Remover item"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable; 