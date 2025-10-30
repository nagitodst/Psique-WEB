<?php
require __DIR__ . '/vendor/autoload.php';

use Kreait\Firebase\Factory;
use Kreait\Firebase\Exception\Auth\InvalidPassword;
use Kreait\Firebase\Exception\Auth\UserNotFound;

$credPath = __DIR__ . '/credentials/psique-7fdb1-firebase-adminsdk-fbsvc-2e760b4cf6.json';

try {
    $factory = (new Factory)
        ->withServiceAccount($credPath)
        ->withDatabaseUri('https://psique-7fdb1-default-rtdb.firebaseio.com/');

    $database = $factory->createDatabase();
    $auth = $factory->createAuth();
} catch (\Exception $e) {
    die("Erro ao conectar ao Firebase: " . $e->getMessage());
}

// FUNÇÕES DE VERIFICAÇÃO
function email_existe($email, $database) {
    $refs = ['pacientes', 'profissionais'];
    foreach ($refs as $refName) {
        $dados = $database->getReference($refName)->getValue();
        if ($dados) {
            foreach ($dados as $usuario) {
                if (isset($usuario['email']) && strtolower($usuario['email']) === strtolower($email)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function telefone_existe($telefone, $database) {
    $refs = ['pacientes', 'profissionais'];
    foreach ($refs as $refName) {
        $dados = $database->getReference($refName)->getValue();
        if ($dados) {
            foreach ($dados as $usuario) {
                if (isset($usuario['telefone']) && $usuario['telefone'] === $telefone) {
                    return true;
                }
            }
        }
    }
    return false;
}

function crp_existe($crp, $database) {
    $profissionais = $database->getReference('profissionais')->getValue();
    if ($profissionais) {
        foreach ($profissionais as $p) {
            if (isset($p['crp']) && strtoupper($p['crp']) === strtoupper($crp)) {
                return true;
            }
        }
    }
    return false;
}

// FUNÇÕES DE CADASTRO
function cadastrar_usuario($dados, $auth, $database) {
    try {
        $user = $auth->createUser([
            'email' => $dados['email'],
            'password' => $dados['senha']
        ]);
        $uid = $user->uid;

        $database->getReference('pacientes/' . $uid)
            ->set([
                'nome' => $dados['nome'],
                'data_nascimento' => $dados['data_nascimento'],
                'telefone' => $dados['telefone'],
                'email' => $dados['email'],
                'data_cadastro' => date('Y-m-d H:i:s')
            ]);
        return true;
    } catch (\Throwable $e) {
        error_log('Erro ao cadastrar paciente: ' . $e->getMessage());
        return false;
    }
}

function cadastrar_profissional($dados, $auth, $database) {
    try {
        $user = $auth->createUser([
            'email' => $dados['email'],
            'password' => $dados['senha']
        ]);
        $uid = $user->uid;

        $database->getReference('profissionais/' . $uid)
            ->set([
                'nome' => $dados['nome'],
                'data_nascimento' => $dados['data_nascimento'],
                'telefone' => $dados['telefone'],
                'crp' => strtoupper($dados['crp']),
                'email' => $dados['email'],
                'data_cadastro' => date('Y-m-d H:i:s')
            ]);
        return true;
    } catch (\Throwable $e) {
        error_log('Erro ao cadastrar profissional: ' . $e->getMessage());
        return false;
    }
}

// FUNÇÕES DE AUTENTICAÇÃO
function autenticar_usuario($email, $senha, $auth) {
    try{
        $signInResult = $auth->signInWithEmailAndPassword($email, $senha);

        return [
            'uid' => $signInResult->firebaseUserId(),
            'idToken' => (string) $signInResult->idToken(),
        ];
    }catch (InvalidPassword $e) {
        error_log('Login Falhou (Senha Invalida): ' . $e->getMessage());
        return 'senha_invalida';
    } catch (UserNotFound $e) {
        error_log('Login Falhou (Usuario Nao Encontrado): ' . $e->getMessage());
        return 'usuario_nao_encontrado';
    } catch (\Throwable $e) {
        error_log('Erro desconhecido no Login: ' . $e->getMessage());
        return 'erro_desconhecido';
    }
}