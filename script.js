document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (email === "teste@gmail.com" && password === "1234") {
        alert("Login realizado com sucesso!");
        // Redirecionar para outra página (exemplo: dashboard.html)
        window.location.href = "solicitar_corrida.html";
    } else {
        alert("E-mail ou senha incorretos!");
    }
});
