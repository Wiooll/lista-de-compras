// frontend/javascript/auth.js

// Inicialize o Parse com suas chaves Back4App
Parse.initialize("QjHdnKmTtyV4ZiyXQrWXaN7fNKpxkFpj666ad8YM", "j25PWNRqvIa8pWjxoMwfEOBNVYNcRQxdHVhZPfiV");
Parse.serverURL = 'https://parseapi.back4app.com/';

document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;

  const user = new Parse.User();
  user.set("username", username);
  user.set("password", password);

  try {
    await user.signUp();
    alert('User registered successfully');
    window.location.href = 'login.html';
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  try {
    await Parse.User.logIn(username, password);
    alert('Login successful');
    window.location.href = 'index.html'; // Redirecionar para a página principal após login
  } catch (error) {
    alert('Invalid username or password');
  }
});
