/* ===== Toggle olho (mostrar/ocultar senha) ===== */
(function () {
  const eyeButtons = document.querySelectorAll('.login-eye');

  eyeButtons.forEach(btn => {
    const input = btn.parentElement.querySelector('.login-input');
    const eyeOpen = btn.querySelector('.login-eye-open');
    const eyeClosed = btn.querySelector('.login-eye-closed');

    btn.addEventListener('click', () => {
      if (input.type === 'password') {
        input.type = 'text';
        eyeOpen.style.display = 'none';
        eyeClosed.style.display = 'block';
      } else {
        input.type = 'password';
        eyeOpen.style.display = 'block';
        eyeClosed.style.display = 'none';
      }
      input.focus();
    });
  });
})();

    /* ===== Floating label + underline animation */
    (function () {
      const groups = document.querySelectorAll('.login-input-group');

      groups.forEach(group => {
        const input = group.querySelector('.login-input');
        const label = group.querySelector('.login-label');

        // Atualiza classes quando focar / desfocar / digitar
        input.addEventListener('focus', () => group.classList.add('login-focused'));
        input.addEventListener('blur', () => group.classList.remove('login-focused'));

        const updateFilled = () => {
          if (input.value && input.value.trim() !== '') group.classList.add('login-filled');
          else group.classList.remove('login-filled');
        };

        input.addEventListener('input', () => {
          updateFilled();
        });

        // Inicial (caso venha com value)
        updateFilled();
      });
    })();