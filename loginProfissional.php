<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Login</title>
  <link rel="stylesheet" href="CSS/log_cad_rec.css" />
  <link rel="stylesheet" href="CSS/toast.css">

</head>
<body class="login-body">

  <header class="login-header">
    <img class="logo" src="img/logo.png" alt="Logo Psique">
  </header>

  <main class="login-main">
    <div class="login-container">
      <h2 class="login-title">Acesse com seu login ou cadastre-se!</h2> <br>

      <form action="inicialPaciente.html" class="login-form">
        <!-- CPF -->
        <div class="login-input-group" id="group-email">
          <input id="email" class="login-input" type="text" autocomplete="off" required/>
          <label for="email" class="login-label">Digite seu E-mail</label>
        </div>

        <!-- Senha -->
        <div class="login-input-group" id="group-senha">
            <input id="senha" class="login-input" type="password" autocomplete="current-password" required/>
            <label for="senha" class="login-label">Digite sua senha</label>
            <button type="button" class="login-eye" aria-label="Mostrar senha" title="Mostrar senha">
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

        <a href="recuperarSenha.html" class="login-forgot">Esqueceu a senha?</a>

        <button type="submit" class="login-btn login-btn-black">Entrar</button>
        </form>
        <button type="button" class="login-btn login-btn-white" onclick="location.href='cadastroProfissional1.php'">Quero criar a minha conta</button>
      

      <p class="login-footer">Protegido por reCAPTCHA – <a href="#">Privacidade</a> – <a href="#">Condições</a></p>
    </div>
  </main>

  <script src="JS/script_login.js"></script>

  <div id="toast" class="toast"></div>
  
  <script src="JS/toast.js"></script>



</body>
</html>
