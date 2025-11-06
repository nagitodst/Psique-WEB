document.addEventListener("DOMContentLoaded", () => {
  const senha = document.getElementById("senha");
  const confirmar = document.getElementById("confirmar");

  // Validação da força da senha
  senha.addEventListener("input", () => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d){8,}$/;
    if (!regex.test(senha.value)) {
      senha.setCustomValidity("⚠️ A senha deve ter: 8 caracteres, incluindo letras e números.");
    } else {
      senha.setCustomValidity("");
    }
  });

  // Validação de confirmação
  confirmar.addEventListener("input", () => {
    if (confirmar.value !== senha.value) {
      confirmar.setCustomValidity("⚠️ As senhas não coincidem.");
    } else {
      confirmar.setCustomValidity("");
    }
  });
});
