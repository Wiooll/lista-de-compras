# 🛒 ListaÊ - Lista de Compras Inteligente

Um aplicativo web progressivo (PWA) para gerenciamento de listas de compras, simples e intuitivo.

## 🔥 Funcionalidades

- ✅ Adição rápida de itens com nome, quantidade e valor
- 📋 Entrada por texto colado em múltiplos formatos
- 🧠 Detecção automática de itens duplicados
- ✍️ Edição dinâmica de quantidade e preço diretamente na tabela
- 🗑️ Remoção individual ou em massa de itens
- 📊 Totais atualizados em tempo real (total e selecionado)
- 📥 Salvamento automático no **Local Storage**
- 💾 Suporte a múltiplas listas salvas
- 🚀 Compartilhamento de lista por `clipboard` ou `Web Share API`
- 📈 Painel de estatísticas com:
  - Total gasto
  - Itens mais comprados
  - Média por lista
- ⚙️ Configurações personalizáveis:
  - Tema (claro, escuro, sistema)
  - Moeda (BRL, USD, EUR)
  - Ordenação padrão
  - Salvamento automático
- 📱 Design responsivo para celular e desktop
- 🔌 Funciona offline (PWA)
- 📱 Instalável em dispositivos móveis

## 🛠️ Tecnologias utilizadas

- HTML5 + CSS3 + JavaScript puro
- FontAwesome para ícones
- LocalStorage para persistência local
- Service Worker para funcionalidade offline
- PWA (Progressive Web App)
- Cache API para armazenamento offline
- Web App Manifest para instalação

## 🖼️ Captura de tela

> Em breve...

## 📦 Como usar

1. Clone o repositório ou baixe os arquivos
2. Abra `index.html` no navegador
3. Comece a usar: cole os itens ou adicione manualmente

## 📱 Como instalar o aplicativo em seu dispositivo

### No Android:

1. Acesse o site do ListaÊ no Chrome
2. Toque no ícone de menu (três pontos) no canto superior direito
3. Selecione "Adicionar à tela inicial" ou "Instalar aplicativo"
4. Siga as instruções na tela

### No iOS:

1. Acesse o site do ListaÊ no Safari
2. Toque no ícone de compartilhamento (retângulo com seta)
3. Selecione "Adicionar à Tela de Início"
4. Toque em "Adicionar" no canto superior direito

### No Desktop (Chrome):

1. Acesse o site do ListaÊ no Chrome
2. Clique no ícone de instalação na barra de endereço (ícone de "+" ou computador)
3. Clique em "Instalar"

## 🌐 Recursos do PWA

- **Modo Offline**: Continue usando o aplicativo mesmo sem conexão com a internet
- **Instalação**: Instale o aplicativo em seu dispositivo para acesso rápido
- **Armazenamento Local**: Seus dados são salvos localmente no dispositivo
- **Interface Responsiva**: Funciona bem em dispositivos móveis e desktop
- **Notificações**: Receba lembretes e atualizações (quando permitido)
- **Sincronização em Segundo Plano**: Dados são sincronizados quando a conexão for restabelecida
- **Atualização Automática**: O service worker atualiza o aplicativo automaticamente
- **Compatibilidade**: Funciona em todos os navegadores modernos

## 💻 Detalhes Técnicos do PWA

O PWA foi implementado usando as seguintes tecnologias e abordagens:

- **Service Worker**: Para cache de recursos e funcionamento offline
- **Manifest.json**: Define como o aplicativo será instalado e exibido
- **Estratégia de Cache**: Cache-first para recursos estáticos, network-first para dados dinâmicos
- **Detecção de Conexão**: Monitoramento de status online/offline
- **API de Instalação**: Prompt personalizado para facilitar a instalação
- **Indicadores Visuais**: Feedback claro sobre o status do aplicativo
- **Página Offline**: Uma página personalizada é exibida quando não há conexão
- **Modos de Exibição**: Configurado para modo standalone para experiência completa de aplicativo

## 👨‍💻 Desenvolvido por

- Willian Sousa  
  [![GitHub](https://img.shields.io/badge/GitHub-Wiooll-000?logo=github)](https://github.com/Wiooll)

## 📄 Licença

Este projeto está licenciado sob a Licença MIT.

---

