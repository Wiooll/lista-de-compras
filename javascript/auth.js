// frontend/javascript/auth.js

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert('User registered successfully');
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
  
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        alert('Login successful');
        window.location.href = 'index.html'; // Redirecionar para a página principal após login
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});