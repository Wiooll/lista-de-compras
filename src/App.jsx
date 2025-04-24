import { useState, useEffect } from 'react';
import Header from './components/Header';
import InputArea from './components/InputArea';
import ProductTable from './components/ProductTable';
import TotalInfo from './components/TotalInfo';
import FloatingMenu from './components/FloatingMenu';
import Modal from './components/Modal';
import Notificacao from './components/Notificacao';

function App() {
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem('lista-e-items');
    return savedItems ? JSON.parse(savedItems) : [];
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [notification, setNotification] = useState(null);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('lista-e-items', JSON.stringify(items));
  }, [items]);

  const handleAddItem = (newItem) => {
    setItems([...items, newItem]);
    showNotification('Item adicionado com sucesso!', 'success');
  };

  const handleToggleItem = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleUpdateItem = (id, updates) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
    showNotification('Item removido com sucesso!', 'info');
  };

  const handleClearList = () => {
    if (window.confirm('Tem certeza que deseja limpar a lista?')) {
      setItems([]);
      showNotification('Lista limpa com sucesso!', 'warning');
    }
  };

  const handleSaveList = () => {
    localStorage.setItem('lista-e-items', JSON.stringify(items));
    showNotification('Lista salva com sucesso!', 'success');
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedItems = [...items].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setItems(sortedItems);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <InputArea onAddItem={handleAddItem} />
        
        <div className="mt-8">
          <ProductTable
            items={items}
            onToggleItem={handleToggleItem}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            sortBy={handleSort}
          />
        </div>

        <TotalInfo items={items} />

        <FloatingMenu
          onClearList={handleClearList}
          onSaveList={handleSaveList}
          onShowStats={() => setIsStatsModalOpen(true)}
        />

        <Modal
          isOpen={isStatsModalOpen}
          onClose={() => setIsStatsModalOpen(false)}
          title="Estatísticas da Lista"
        >
          <div className="space-y-4">
            <p>Total de Itens: {items.length}</p>
            <p>Itens Marcados: {items.filter(item => item.checked).length}</p>
            <p>
              Valor Total:{' '}
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(items.reduce((acc, item) => acc + item.price * item.quantity, 0))}
            </p>
          </div>
        </Modal>

        {notification && (
          <Notificacao
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </main>
    </div>
  );
}

export default App; 