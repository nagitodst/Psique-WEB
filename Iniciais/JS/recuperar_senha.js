// Importa os módulos do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB1cdz59Y1QAz6zDBXt3hBIFSYKWFL59CQ", 
  authDomain: "psique-7fdb1.firebaseapp.com", 
  databaseURL: "https://psique-7fdb1-default-rtdb.firebaseio.com",
  projectId: "psique-7fdb1", 
  storageBucket: "psique-7fdb1.firebasestorage.app", 
  messagingSenderId: "786817532906", 
  appId: "1:786817532906:web:b8c3574ab7cdcb827ba893"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Manipula o envio do formulário
document.getElementById("recuperar-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const mensagem = document.getElementById("mensagem");

  sendPasswordResetEmail(auth, email)
    .then(() => {
      mensagem.textContent = "✅ Um link de redefinição foi enviado para seu e-mail. Caso não o encontre na caixa principal, verifique seu Spam.";
      mensagem.style.color = "green";
    })
    .catch((error) => {
      console.error(error);
      if (error.code === "auth/user-not-found") {
        mensagem.textContent = "❌ Nenhuma conta encontrada com esse e-mail.";
      } else if (error.code === "auth/invalid-email") {
        mensagem.textContent = "⚠️ E-mail inválido.";
      } else {
        mensagem.textContent = "⚠️ Ocorreu um erro. Tente novamente.";
      }
      mensagem.style.color = "red";
    });
});
