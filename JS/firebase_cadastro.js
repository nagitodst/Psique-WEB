// Importa módulos do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB1cdz59Y1QAz6zDBXt3hBIFSYKWFL59CQ",
  authDomain: "psique-7fdb1.firebaseapp.com",
  databaseURL: "https://psique-7fdb1-default-rtdb.firebaseio.com/",
  projectId: "psique-7fdb1",
  storageBucket: "psique-7fdb1.firebasestorage.app",
  messagingSenderId: "786817532906",
  appId: "1:786817532906:web:b8c3574ab7cdcb827ba893"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Recupera email e senha da sessão PHP
const email = document.body.dataset.email;
const senha = document.body.dataset.senha;

// Captura o envio do formulário
document.getElementById("form-cadastro").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const data_nascimento = document.getElementById("data_nascimento").value.trim();
  const telefone = document.getElementById("telefone").value.trim();

  if (!nome || !data_nascimento || !telefone) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  try {
    // 1️⃣ Cria usuário no Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const uid = userCredential.user.uid;

    // 2️⃣ Salva todos os dados no Realtime Database
    await set(ref(db, "pacientes/" + uid), {
      nome,
      data_nascimento,
      telefone,
      email,
      data_cadastro: new Date().toISOString()
    });

    alert("✅ Cadastro concluído com sucesso!");
    window.location.href = "login.php"; // redireciona para a tela de login

  } catch (error) {
    console.error("Erro Firebase:", error.code, error.message);

    if (error.code === "auth/email-already-in-use") {
      alert("Esse e-mail já está cadastrado!");
    } else if (error.code === "auth/invalid-email") {
      alert("E-mail inválido!");
    } else if (error.code === "auth/weak-password") {
      alert("A senha é muito fraca. Tente outra.");
    } else {
      alert("Erro ao criar conta: " + error.message);
    }
  }
});
