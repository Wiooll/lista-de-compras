// Configurações dos gestos
const SWIPE_THRESHOLD = 100; // Distância mínima para considerar um swipe
const SWIPE_TIMEOUT = 300; // Tempo máximo para considerar um swipe (ms)

class GestureManager {
  constructor() {
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchStartTime = 0;
    this.currentRow = null;
    this.isAnimating = false;
  }

  // Inicializa os eventos de toque na tabela
  init() {
    const tabela = document.getElementById('produtos');
    if (!tabela) return;

    tabela.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    tabela.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
    tabela.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
  }

  // Manipula o início do toque
  handleTouchStart(e) {
    if (this.isAnimating) return;

    const row = this.findParentRow(e.target);
    if (!row) return;

    this.currentRow = row;
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
    this.touchStartTime = Date.now();

    // Adiciona classe para feedback visual
    row.classList.add('row-touching');
  }

  // Manipula o movimento do toque
  handleTouchMove(e) {
    if (!this.currentRow || this.isAnimating) return;

    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const deltaX = touchX - this.touchStartX;
    const deltaY = Math.abs(touchY - this.touchStartY);

    // Se o movimento vertical for maior que o horizontal, permite o scroll
    if (deltaY > Math.abs(deltaX)) {
      return;
    }

    // Previne o scroll da página durante o swipe horizontal
    e.preventDefault();

    // Aplica a transformação com limite de movimento
    const maxTranslate = 100;
    const translate = Math.max(-maxTranslate, Math.min(maxTranslate, deltaX));
    this.currentRow.style.transform = `translateX(${translate}px)`;

    // Ajusta a opacidade baseada no movimento
    const opacity = Math.max(0.3, 1 - Math.abs(deltaX) / 200);
    this.currentRow.style.opacity = opacity;

    // Adiciona indicadores visuais baseados na direção
    if (deltaX > 0) {
      this.currentRow.classList.add('swipe-right');
      this.currentRow.classList.remove('swipe-left');
    } else {
      this.currentRow.classList.add('swipe-left');
      this.currentRow.classList.remove('swipe-right');
    }
  }

  // Manipula o fim do toque
  handleTouchEnd(e) {
    if (!this.currentRow || this.isAnimating) return;

    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - this.touchStartX;
    const deltaTime = Date.now() - this.touchStartTime;

    // Remove classe de feedback visual
    this.currentRow.classList.remove('row-touching');
    this.currentRow.classList.remove('swipe-left', 'swipe-right');

    // Verifica se o movimento foi rápido e longo o suficiente para ser um swipe
    if (Math.abs(deltaX) > SWIPE_THRESHOLD && deltaTime < SWIPE_TIMEOUT) {
      this.handleSwipe(deltaX);
    } else {
      this.resetRowPosition();
    }
  }

  // Manipula a ação do swipe
  handleSwipe(deltaX) {
    this.isAnimating = true;
    const row = this.currentRow;
    const width = row.offsetWidth;

    // Configura a animação de saída
    row.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
    row.style.transform = `translateX(${deltaX > 0 ? width : -width}px)`;
    row.style.opacity = '0';

    setTimeout(() => {
      if (deltaX > 0) {
        // Swipe para direita: marcar/desmarcar como comprado
        const checkbox = row.querySelector('.checkbox');
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event('change'));
        }
        this.resetRowPosition();
      } else {
        // Swipe para esquerda: remover item
        removerProduto(row);
      }
      this.isAnimating = false;
    }, 300);
  }

  // Reseta a posição da linha com animação
  resetRowPosition() {
    if (!this.currentRow) return;

    this.currentRow.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
    this.currentRow.style.transform = '';
    this.currentRow.style.opacity = '';

    // Limpa a transição após a animação
    setTimeout(() => {
      if (this.currentRow) {
        this.currentRow.style.transition = '';
      }
    }, 300);
  }

  // Encontra a linha pai mais próxima
  findParentRow(element) {
    while (element && element.tagName !== 'TR') {
      element = element.parentElement;
    }
    return element;
  }
}

// Inicializa o gerenciador de gestos quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  const gestureManager = new GestureManager();
  gestureManager.init();
}); 