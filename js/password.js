(function () {
  const presetPassword = 'hyh2026';
  const authKey = 'loanDemoAuthed';
  const authValue = 'preset-password-passed';

  const loginForm = document.getElementById('loginForm');
  const loginPassword = document.getElementById('loginPassword');

  function setError(name, message) {
    const field = document.querySelector(`[data-field="${name}"]`);
    const error = document.getElementById(`${name}Error`);
    if (!field || !error) {
      return;
    }

    field.classList.toggle('is-error', Boolean(message));
    error.textContent = message || '';
  }

  function clearErrors() {
    setError('loginPassword', '');
  }

  function validatePassword(value, fieldName) {
    if (!value.trim()) {
      setError(fieldName, '请输入密码');
      return false;
    }

    return true;
  }

  function enterApplyPage() {
    sessionStorage.setItem(authKey, authValue);
    window.location.href = './index.html';
  }

  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    clearErrors();

    const inputPassword = loginPassword.value;

    if (!validatePassword(inputPassword, 'loginPassword')) {
      loginPassword.focus();
      return;
    }

    if (inputPassword !== presetPassword) {
      setError('loginPassword', '密码不正确');
      loginPassword.focus();
      return;
    }

    enterApplyPage();
  });

  loginPassword.addEventListener('input', clearErrors);
  loginPassword.focus();
})();
