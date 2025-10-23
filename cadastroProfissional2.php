<?php
session_start();

// se não veio da parte 1, bloqueia
if (!isset($_SESSION['cadastro_email']) || !isset($_SESSION['cadastro_crp']) || !isset($_SESSION['cadastro_senha'])) {
    die("⚠️ Erro: sessão expirada. Volte e preencha novamente a Parte 1.");
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Criar Conta Profissional - Parte 2</title>
  <link rel="stylesheet" href="CSS/log_cad_rec.css" />
</head>
<body class="login-body"
  data-email="<?php echo htmlspecialchars($_SESSION['cadastro_email']); ?>"
  data-crp="<?php echo htmlspecialchars($_SESSION['cadastro_crp']); ?>"
  data-senha="<?php echo htmlspecialchars($_SESSION['cadastro_senha']); ?>">

  <header class="login-header">
    <img class="logo" src="img/logo.png" alt="Logo Psique">
  </header>

  <main class="login-main">
    <div class="login-container">
      <h1 class="login-title">Para concluir seu cadastro, precisamos de mais alguns dados</h1>
      <h3 class="login-subtitle">Parte 2 de 2</h3>
      
      <form id="form-cadastro" method="POST" action="cadastroProfissionalFinal.php" class="login-form">
       
        <div class="login-input-group" id="group-nome">
          <input id="nome" name="nome" class="login-input" type="text" autocomplete="off" required/>
          <label for="nome" class="login-label">Digite seu nome completo</label>
        </div>

        <div class="login-input-group" id="group-data">
          <input id="data_nascimento" name="data_nascimento" class="login-input" type="date" autocomplete="off" required/>
          <label for="data_nascimento" class="login-label">Digite sua data de nascimento</label>
        </div>

        <div class="login-input-group" id="group-tel">
          <input id="telefone" name="telefone" class="login-input" type="tel" placeholder="27 988123456" pattern="^\d{2}\s9\d{8}$" autocomplete="off" required/>
          <label for="telefone" class="login-label">Digite seu número de telefone</label>
        </div>

        <div class="checkbox">
          <input type="checkbox" id="termos" required>
          <label for="termos">
            Li e concordo com os <a href="#">Termos & Condições</a> e com a
            <a href="#">Política de Privacidade</a>
          </label>
        </div> <br>

        <button type="submit" class="login-btn login-btn-black">Finalizar meu cadastro</button>
      </form>
      
    </div>
  </main>
</body>
</html>
