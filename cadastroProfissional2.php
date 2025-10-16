<?php
session_start();
require_once 'firebase.php';

// Se não tiver CRP e senha salvos da parte 1 → expira
if (!isset($_SESSION['cadastro_crp']) || !isset($_SESSION['cadastro_senha'])) {
    header("Location: loginProfissional.php?erro=expirou");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome  = $_POST['nome'] ?? '';
    $data_nascimento = $_POST['data_nascimento'] ?? '';
    $telefone = $_POST['telefone'] ?? '';

    $crp = $_SESSION['cadastro_crp'];
    $senha_hash = $_SESSION['cadastro_senha'];

    // 1. Validar campos
    if (empty($nome) || empty($data_nascimento) || empty($telefone)) {
        header("Location: loginProfissional.php?erro=campos");
        exit;
    }

    // 2. Validar formato do telefone
    if (!preg_match("/^\(\d{2}\)\s\d{5}-\d{4}$/", $telefone)) {
        header("Location: loginProfissional.php?erro=telefone");
        exit;
    }

    // 3. Verificar se telefone já existe
    if (telefone_existe($telefone, $database)) {
        header("Location: loginProfissional.php?erro=telefone_existente");
        exit;
    }

    // 4. Salvar no Firebase
    $dados = [
        'nome' => $nome,
        'data_nascimento' => $data_nascimento,
        'telefone' => $telefone,
        'crp' => $crp,
        'senha' => $senha_hash
    ];

    $resultado = $database->getReference('profissionais')->push($dados);

    if ($resultado) {
        session_unset();
        session_destroy();
        header("Location: loginProfissional.php?sucesso=true");
        exit;
    } else {
        header("Location: loginProfissional.php?erro=firebase");
        exit;
    }
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
<body class="login-body">

  <header class="login-header">
    <img class="logo" src="img/logo.png" alt="Logo Psique">
  </header>

  <main class="login-main">
    <div class="login-container">
      <h1 class="login-title">Para concluir seu cadastro, precisamos de mais alguns dados</h1>
      <h3 class="login-subtitle">Parte 2 de 2</h3>

  <form id="form-cadastro" action="cadastroProfissional2.php" method="POST" class="login-form">
    <div class="login-input-group" id="group-nome">
      <input id="nome" name="nome" class="login-input" type="text" autocomplete="off" required/>
      <label for="nome" class="login-label">Digite seu nome completo</label>
    </div>

    <div class="login-input-group" id="group-data">
      <input id="data_nascimento" name="data_nascimento" class="login-input" type="date" autocomplete="off" required/>
      <label for="data_nascimento" class="login-label">Digite sua data de nascimento</label>
    </div>

    <div class="login-input-group" id="group-tel">
      <input id="telefone" name="telefone" class="login-input" type="tel"
            placeholder="(99) 99999-9999"
            pattern="\(\d{2}\)\s\d{5}-\d{4}" autocomplete="off" required/>
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

      

      <p class="login-footer">Protegido por reCAPTCHA – <a href="#">Privacidade</a> – <a href="#">Condições</a></p>
    </div>
  </main>

  <script src="JS/script_login.js"></script>
  <script type="module" src="JS/firebase_cadastro.js"></script>


</body>
</html>
