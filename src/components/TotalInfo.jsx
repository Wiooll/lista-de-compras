const TotalInfo = ({ items }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const totalItems = items.length;
  const checkedItems = items.filter(item => item.checked).length;
  const totalValue = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const checkedValue = items
    .filter(item => item.checked)
    .reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mt-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Itens na Lista
          </h3>
          <p className="mt-1 text-2xl font-semibold">
            {checkedItems}/{totalItems}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Valor Total
          </h3>
          <p className="mt-1 text-2xl font-semibold text-green-600 dark:text-green-400">
            {formatPrice(totalValue)}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Itens Marcados
          </h3>
          <p className="mt-1 text-lg">
            {((checkedItems / totalItems) * 100 || 0).toFixed(0)}%
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Valor Marcado
          </h3>
          <p className="mt-1 text-lg">
            {formatPrice(checkedValue)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TotalInfo; 