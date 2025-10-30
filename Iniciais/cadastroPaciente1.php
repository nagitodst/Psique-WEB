<?php
session_start();
require_once __DIR__ . '/../firebase.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $senha = $_POST['senha'] ?? '';
    $confirmar = $_POST['confirmar'] ?? '';

    // 1. Verificar senhas iguais
    if ($senha !== $confirmar) {
        die("As senhas não coincidem!");
    }

    // 2. Validar força da senha no backend
    $regexSenha = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/';
    if (!preg_match($regexSenha, $senha)) {
        die("A senha deve ter ao menos 8 caracteres, incluindo maiúsculas, minúsculas, números e símbolos.");
    }

    // 3. Validar e-mail
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("Digite um e-mail válido!");
    }

    // 4. Verificar se e-mail já existe no Firebase
    if (email_existe($email, $database)) {
        die("Este e-mail já está cadastrado!");
    }

    // Salva temporariamente em sessão
    $_SESSION['cadastro_email'] = $email;
    $_SESSION['cadastro_senha'] = $senha;

    // Vai para a parte 2
    header("Location: cadastroPaciente2.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Criar Conta Paciente - Parte 1</title>
  <link rel="stylesheet" href="CSS/log_cad_rec.css" />
</head>
<body class="login-body">

  <header class="login-header">
    <img class="logo" src="../img/logo.png" alt="Logo Psique">
  </header>

  <main class="login-main">
    <div class="login-container">
      <h1 class="login-title">Vamos Criar Seu Acesso?</h1>
      <h3 class="login-subtitle">Parte 1 de 2</h3>

      <form action="cadastroPaciente1.php" method="POST" class="login-form">
        <!-- email -->
        <div class="login-input-group">
          <input id="email" name="email" class="login-input" type="email" required />
          <label for="email" class="login-label">Digite seu E-mail</label>
        </div>

        <!-- senha -->
        <div class="login-input-group">
          <input 
            id="senha" 
            name="senha" 
            class="login-input" 
            type="password" 
            required
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$"
            title="A senha precisa ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos."
          />
          <label for="senha" class="login-label">Digite sua senha</label>
          <button type="button" class="login-eye" aria-label="Mostrar senha">
            <!-- SVG olho (duas versões controladas por JS) -->
            <svg class="login-eye-open" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7z" stroke="#8F8F8F" stroke-width="1.1" fill="none"/>
              <circle cx="12" cy="12" r="3" stroke="#8F8F8F" stroke-width="1.1" fill="none"/>
            </svg>

            <svg class="login-eye-closed" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:none;">
              <path d="M3 3l18 18" stroke="#8F8F8F" stroke-width="1.2" stroke-linecap="round"/>
              <path d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7 1.55 0 3.03-.28 4.36-.78" stroke="#8F8F8F" stroke-width="1.1" fill="none"/>
            </svg>
          </button>
        </div>

        <small>
          <h4>A senha deve conter, ao menos:</h4>
          <ul>
            <li>8 Caracteres ou mais</li>
            <li>1 Letra maiúscula e minúscula</li>
            <li>1 Número</li>
            <li>1 Caractere especial (como !, @, #, $, etc.)</li>
          </ul>
        </small>

        <!-- confirmar senha -->
        <div class="login-input-group">
          <input id="confirmar" name="confirmar" class="login-input" type="password" required />
          <label for="confirmar" class="login-label">Confirme sua senha</label>
          <button type="button" class="login-eye" aria-label="Mostrar senha">
            <svg class="login-eye-open" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7z" stroke="#8F8F8F" stroke-width="1.1" fill="none"/>
              <circle cx="12" cy="12" r="3" stroke="#8F8F8F" stroke-width="1.1" fill="none"/>
            </svg>

            <svg class="login-eye-closed" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:none;">
              <path d="M3 3l18 18" stroke="#8F8F8F" stroke-width="1.2" stroke-linecap="round"/>
              <path d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7 1.55 0 3.03-.28 4.36-.78" stroke="#8F8F8F" stroke-width="1.1" fill="none"/>
            </svg>
          </button>
        </div>

        <button type="submit" class="login-btn login-btn-black">Continuar</button>
      </form>

  <script src="JS/script_login.js"></script>
  <script src="JS/script_senha.js"></script>
</body>
</html>
