document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("register-form");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const message = document.getElementById("message");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (password !== confirmPassword) {
            message.textContent = "As senhas não coincidem!";
            return;
        }

        message.textContent = "";

        const user = {
            username: username,
            password: password
        };

        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                message.style.color = "green";
                message.textContent = "Cadastro realizado com sucesso!";
                form.reset();
            } else {
                message.textContent = "Erro ao cadastrar usuário.";
            }
        })
        .catch(error => {
            message.textContent = "Erro ao conectar ao servidor.";
        });
    });
});
