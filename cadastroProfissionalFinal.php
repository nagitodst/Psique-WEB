<?php
session_start();
require_once 'firebase.php'; // Importa conexão e funções

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Dados vindos do formulário da etapa 2
    $nome = $_POST['nome'] ?? '';
    $data_nascimento = $_POST['data_nascimento'] ?? '';
    $telefone = $_POST['telefone'] ?? '';
    
    // Dados armazenados na sessão (email, senha e crp da primeira etapa)
    $email = $_SESSION['cadastro_email'] ?? '';
    $senha = $_SESSION['cadastro_senha'] ?? '';
    $crp = $_SESSION['cadastro_crp'] ?? ''; // CRP vem da sessão, pois foi salvo na parte 1 e não é enviado na parte 2.

    // Validação básica
    if (empty($nome) || empty($data_nascimento) || empty($telefone) || empty($crp) || empty($email) || empty($senha)) {
        header("Location: cadastroProfissional2.php?erro=campos");
        exit;
    }

    // Verificações de duplicidade
    if (email_existe($email, $database)) {
        header("Location: cadastroProfissional2.php?erro=email_existente");
        exit;
    }
    if (telefone_existe($telefone, $database)) {
        header("Location: cadastroProfissional2.php?erro=telefone_existente");
        exit;
    }
    if (crp_existe($crp, $database)) {
        header("Location: cadastroProfissional2.php?erro=crp_existente");
        exit;
    }

    //array de dados
    $dados = [
        'nome' => $nome,
        'data_nascimento' => $data_nascimento,
        'telefone' => $telefone,
        'crp' => $crp,
        'email' => $email,
        'senha' => $senha
    ];

    //cadastrar no Firebase
    if (cadastrar_profissional($dados, $auth, $database)) {
        session_unset();
        header("Location: loginProfissional.php?sucesso=1");
        exit;
    } else {
        header("Location: cadastroProfissional2.php?erro=firebase");
        exit;
    }
} else {
    header("Location: cadastroProfissional1.php");
    exit;
}