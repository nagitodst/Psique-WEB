<?php
require __DIR__ . '/vendor/autoload.php';

use Kreait\Firebase\Factory;

$credPath = __DIR__ . '/credentials/psique-7fdb1-firebase-adminsdk-fbsvc-2e760b4cf6.json';

try {
    $factory = (new Factory)
         ->withServiceAccount($credPath)
         ->withDatabaseUri('https://psique-7fdb1-default-rtdb.firebaseio.com/');

     $database = $factory->createDatabase();
    // ⚠️ Adicione esta linha para criar a instância do Auth
    $auth = $factory->createAuth(); 
} catch (\Exception $e) {
    die("Erro ao conectar ao Firebase: " . $e->getMessage());
}

// --- Funções de verificação ---

function email_existe($email, $database)
{
    $ref = $database->getReference('usuarios');
    $usuarios = $ref->getValue();

    if ($usuarios) {
        foreach ($usuarios as $usuario) {
            if (isset($usuario['email']) && strtolower($usuario['email']) === strtolower($email)) {
                return true;
            }
        }
    }
    return false;
}

function telefone_existe($telefone, $database)
{
    $ref = $database->getReference('usuarios');
    $usuarios = $ref->getValue();

    if ($usuarios) {
        foreach ($usuarios as $usuario) {
            if (isset($usuario['telefone']) && $usuario['telefone'] === $telefone) {
                return true;
            }
        }
    }
    return false;
}

function crp_existe($crp, $database)
{
    $ref = $database->getReference('profissionais'); // nó separado para os profissionais
    $profissionais = $ref->getValue();

    if ($profissionais) {
        foreach ($profissionais as $p) {
            if (isset($p['crp']) && strtoupper($p['crp']) === strtoupper($crp)) {
                return true;
            }
        }
    }
    return false;
}



function cadastrar_usuario($dados, $auth, $database) {
     try {
         $user = $auth->createUser([ 
            'email' => $dados['email'],
            'password' => $dados['senha'] 
         ]);
        $uid = $user->uid;
     } catch (\Throwable $e) {
         return false;
     }
    try {
         $database->getReference('pacientes/' . $uid)
                ->set([
                    'nome' => $dados['nome'],
                     'data_nascimento' => $dados['data_nascimento'],
                     'email' => $dados['email'],

            ]);
        return true;
     } catch (\Throwable $e) {
         return false;
     }
}