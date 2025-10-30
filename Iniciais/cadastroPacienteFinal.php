<?php
session_start();
require_once __DIR__ . '/../firebase.php';

if (!isset($_SESSION['cadastro_email']) || !isset($_SESSION['cadastro_senha'])) {
    header("Location: loginPaciente.php?erro=expirou");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Dados vindos do formulário da etapa 2
    $nome = $_POST['nome'] ?? '';
    $data_nascimento = $_POST['data_nascimento'] ?? '';
    $telefone = $_POST['telefone'] ?? '';

    // Dados armazenados na sessão (email e senha da primeira etapa)
    $email = $_SESSION['cadastro_email'] ?? '';
    $senha = $_SESSION['cadastro_senha'] ?? '';

    // Validação básica
    if (empty($nome) || empty($data_nascimento) || empty($telefone) || empty($email) || empty($senha)) {
        header("Location: cadastroPaciente2.php?erro=campos");
        exit;
    }

    // Verifica duplicidades
    elseif (email_existe($email, $database)) {
        header("Location: cadastroPaciente2.php?erro=email_existente");
        exit;
    }

    elseif (telefone_existe($telefone, $database)) {
        header("Location: cadastroPaciente2.php?erro=telefone_existente");
        exit;
    }

    // Array de dados
    $dados = [
        'nome' => $nome,
        'data_nascimento' => $data_nascimento,
        'telefone' => $telefone,
        'email' => $email,
        'senha' => $senha
    ];

    // Tenta cadastrar no Firebase
    if (cadastrar_usuario($dados, $auth, $database)) {
        // Limpa sessão e redireciona com sucesso
        session_unset();
        header("Location: loginPaciente.php?sucesso=1");
        exit;
    } else {
        header("Location: cadastroPaciente2.php?erro=firebase");
        exit;
    }
} else {
    header("Location: cadastroPaciente1.php");
    exit;
}