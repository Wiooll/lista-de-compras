// Funções relacionadas ao PWA (Progressive Web App)

// Função para verificar se o aplicativo está sendo executado no modo standalone
function isRunningStandalone() {
  return (window.matchMedia('(display-mode: standalone)').matches) || 
         (window.navigator.standalone) || 
         document.referrer.includes('android-app://');
}

// Função para mostrar notificação de instalação do PWA
function mostrarNotificacaoInstalacao() {
  // Só mostra a notificação se não estiver em modo standalone (já instalado)
  if (!isRunningStandalone()) {
    mostrarNotificacao("Instale o app para usá-lo offline!", "info", 5000);
  }
}

// Atualizar o indicador de status de conexão
function atualizarIndicadorStatus() {
  const estaOnline = navigator.onLine;
  const indicador = document.getElementById('status-indicator');
  const statusText = document.getElementById('status-text');
  
  if (!indicador || !statusText) return;
  
  if (estaOnline) {
    indicador.className = 'status-indicator status-online';
    statusText.textContent = 'Online';
    indicador.querySelector('i').className = 'fas fa-wifi';
    
    // Esconder o indicador após 3 segundos
    setTimeout(() => {
      indicador.classList.add('hidden');
    }, 3000);
  } else {
    indicador.className = 'status-indicator status-offline';
    statusText.textContent = 'Offline';
    indicador.querySelector('i').className = 'fas fa-wifi-slash';
    indicador.classList.remove('hidden');
  }
}

// Verificar status da conexão
function verificarConexao() {
  const estaOnline = navigator.onLine;
  if (!estaOnline) {
    mostrarNotificacao("Você está offline. O app continuará funcionando com dados salvos.", "aviso", 4000);
  }
  atualizarIndicadorStatus();
  return estaOnline;
}

// Adicionar eventos de monitoramento de conexão
window.addEventListener('online', () => {
  mostrarNotificacao("Você está online novamente!", "sucesso", 3000);
  atualizarIndicadorStatus();
});

window.addEventListener('offline', () => {
  mostrarNotificacao("Você está offline. Seus dados estão sendo salvos localmente.", "aviso", 4000);
  atualizarIndicadorStatus();
});

// Função para verificar e mostrar o banner de instalação
function verificarInstalacao() {
  // Verificar se o app já está instalado
  if (isRunningStandalone()) {
    // Esconder elementos de instalação se necessário
    const modalInstalar = document.getElementById('modal-instalar');
    if (modalInstalar) {
      modalInstalar.style.display = 'none';
    }
    
    // Adicionar classe ao body para aplicar estilos específicos de PWA
    document.body.classList.add('pwa-mode');
    
    // Mostrar notificação de bem-vindo ao modo app
    mostrarNotificacao("Bem-vindo ao app ListaÊ!", "sucesso", 3000);
  } else {
    // Mostrar notificação sugerindo a instalação após alguns segundos de uso
    setTimeout(() => {
      mostrarNotificacaoInstalacao();
    }, 30000); // 30 segundos
  }
}

// Inicializar funções do PWA
document.addEventListener('DOMContentLoaded', () => {
  verificarInstalacao();
  verificarConexao();
}); 