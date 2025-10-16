<?php
session_start();
require_once 'firebase.php';

if (!isset($_SESSION['cadastro_email']) || !isset($_SESSION['cadastro_senha'])) {
    header("Location: loginPaciente.html?erro=expirou");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome  = $_POST['nome'] ?? '';
    $data_nascimento = $_POST['data_nascimento'] ?? '';
    $telefone = $_POST['telefone'] ?? '';

    $email = $_SESSION['cadastro_email'];
    $senha = $_SESSION['cadastro_senha'];

    if (empty($nome) || empty($data_nascimento) || empty($telefone)) {
        header("Location: loginPaciente.html?erro=campos");
        exit;
    }
    elseif (!preg_match("/^\d{2}\s\d{9}$/", $telefone)) {
        header("Location: loginPaciente.html?erro=telefone");
        exit;
    }
    elseif (telefone_existe($telefone, $database)) {
        header("Location: loginPaciente.html?erro=telefone_existente");
        exit;
    }

    // Salva no Firebase
    $dados = [
        'nome' => $nome,
        'data_nascimento' => $data_nascimento,
        'telefone' => $telefone,
        'email' => $email,
        'senha' => $senha
    ];

    $resultado = cadastrar_usuario($dados, $auth,$database);

    if ($resultado) {
        session_unset();
        session_destroy();
        header("Location: loginPaciente.php?sucesso=true");
exit;

    } else {
        die("Falha no Cadastro (Verifique os Logs do Firebase.php)");
        // header("Location: loginPaciente.php?erro=firebase");
        // exit;
    }
}

