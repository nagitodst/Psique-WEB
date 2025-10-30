document.addEventListener("DOMContentLoaded", () => {
  function showToast(message, type) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // Verifica parâmetros da URL
  const urlParams = new URLSearchParams(window.location.search);
  const isProfissional = window.location.pathname.includes("Profissional");

  if (urlParams.has('sucesso')) {
    showToast('🎉 Cadastro realizado com sucesso! Agora você pode fazer login.', 'success');
  } 
  else if (urlParams.has('erro')) {
    const erro = urlParams.get('erro');
    let msg = '';

    switch(erro) {
      case 'expirou': msg = '⚠️ Sessão expirada. Faça o cadastro novamente.'; break;
      case 'campos': msg = '⚠️ Preencha todos os campos corretamente.'; break;
      case 'telefone': msg = '⚠️ Telefone inválido.'; break;
      case 'telefone_existente': msg = '⚠️ Telefone já cadastrado.'; break;
      case 'firebase': msg = '❌ Erro ao salvar dados. Tente novamente.'; break;
      case 'login':
        msg = isProfissional
          ? '❌ CRP ou senha incorretos.'
          : '❌ E-mail ou senha incorretos.';
        break;
      default: msg = '❌ Ocorreu um erro desconhecido.';
    }

    showToast(msg, 'error');
  }
});
