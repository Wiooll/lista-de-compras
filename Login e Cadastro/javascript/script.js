document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Impede o envio do formulário

  // Aqui você pode adicionar a lógica de autenticação
  // Por exemplo, verificar o nome de usuário e a senha

  const username = document.getElementById('username').value;
  const password = document.getElementById('senha').value;

  // Suponha que a autenticação seja bem-sucedida
  // Redireciona para a página principal
  if (username === 'Wiooll' && password === '1234') { // Exemplo de validação
    window.location.href = 'https://github.com/Wiooll/lista-de-compras/blob/main/home.html'; // Substitua pelo caminho da sua página principal
  } else {
    alert('Nome de usuário ou senha incorretos');
  }
});

function showRegisterForm() {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('register-form').style.display = 'block';
}

function showLoginForm() {
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('register-form').style.display = 'none';
}
