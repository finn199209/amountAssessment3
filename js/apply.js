(function () {
  const storageKey = 'loanApplyData';
  const authKey = 'loanDemoAuthed';
  const authValue = 'preset-password-passed';

  if (sessionStorage.getItem(authKey) !== authValue) {
    window.location.href = './password.html';
    return;
  }

  const form = document.getElementById('applyForm');
  const fields = {
    creditAmount: document.getElementById('creditAmount'),
    companyName: document.getElementById('companyName'),
    unifiedSocialCreditCode: document.getElementById('unifiedSocialCreditCode'),
    annualInterestRate: document.getElementById('annualInterestRate'),
    applyDate: document.getElementById('applyDate'),
    repaymentMethod: document.getElementById('repaymentMethod'),
    repaymentPeriod: document.getElementById('repaymentPeriod')
  };

  const moneyPattern = /^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/;

  function getToday() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function setError(name, message) {
    const field = document.querySelector(`[data-field="${name}"]`);
    const error = document.getElementById(`${name}Error`);
    if (!field || !error) {
      return;
    }

    field.classList.toggle('is-error', Boolean(message));
    error.textContent = message || '';
  }

  function sanitizeDecimalInput(input) {
    let value = input.value.replace(/[^\d.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) {
      value = `${parts[0]}.${parts.slice(1).join('')}`;
    }

    const decimalIndex = value.indexOf('.');
    if (decimalIndex !== -1) {
      value = `${value.slice(0, decimalIndex + 1)}${value.slice(decimalIndex + 1, decimalIndex + 3)}`;
    }

    input.value = value;
  }

  function getFormData() {
    return {
      creditAmount: fields.creditAmount.value.trim(),
      companyName: fields.companyName.value.trim(),
      unifiedSocialCreditCode: fields.unifiedSocialCreditCode.value.trim().toUpperCase(),
      annualInterestRate: fields.annualInterestRate.value.trim(),
      applyDate: fields.applyDate.value,
      repaymentMethod: fields.repaymentMethod.value,
      repaymentPeriod: fields.repaymentPeriod.value
    };
  }

  function validate(data) {
    const errors = {};

    if (!moneyPattern.test(data.creditAmount) || Number(data.creditAmount) <= 0) {
      errors.creditAmount = '请输入有效的授信金额';
    }

    if (!data.companyName) {
      errors.companyName = '请输入企业名称';
    } else if (data.companyName.length > 50) {
      errors.companyName = '企业名称最多 50 个字符';
    }

    if (!data.unifiedSocialCreditCode) {
      errors.unifiedSocialCreditCode = '请输入统一社会信用代码';
    }

    if (!moneyPattern.test(data.annualInterestRate) || Number(data.annualInterestRate) <= 0 || Number(data.annualInterestRate) > 100) {
      errors.annualInterestRate = '请输入 0 到 100 之间的贷款年化利率';
    }

    if (!data.applyDate) {
      errors.applyDate = '请选择贷款申请日期';
    }

    if (!data.repaymentMethod) {
      errors.repaymentMethod = '请选择还款方式';
    }

    if (!data.repaymentPeriod) {
      errors.repaymentPeriod = '请选择还款周期';
    }

    return errors;
  }

  function clearErrorOnInput(name) {
    const data = getFormData();
    const errors = validate(data);
    setError(name, errors[name]);
  }

  fields.applyDate.value = getToday();

  fields.creditAmount.addEventListener('input', function () {
    sanitizeDecimalInput(fields.creditAmount);
    clearErrorOnInput('creditAmount');
  });

  fields.annualInterestRate.addEventListener('input', function () {
    sanitizeDecimalInput(fields.annualInterestRate);
    clearErrorOnInput('annualInterestRate');
  });

  fields.unifiedSocialCreditCode.addEventListener('input', function () {
    fields.unifiedSocialCreditCode.value = fields.unifiedSocialCreditCode.value.toUpperCase();
    clearErrorOnInput('unifiedSocialCreditCode');
  });

  Object.keys(fields).forEach(function (name) {
    if (name === 'creditAmount' || name === 'annualInterestRate' || name === 'unifiedSocialCreditCode') {
      return;
    }

    fields[name].addEventListener('input', function () {
      clearErrorOnInput(name);
    });
    fields[name].addEventListener('change', function () {
      clearErrorOnInput(name);
    });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const data = getFormData();
    fields.unifiedSocialCreditCode.value = data.unifiedSocialCreditCode;
    const errors = validate(data);
    const fieldNames = Object.keys(fields);

    fieldNames.forEach(function (name) {
      setError(name, errors[name]);
    });

    const firstErrorName = fieldNames.find(function (name) {
      return Boolean(errors[name]);
    });

    if (firstErrorName) {
      fields[firstErrorName].focus();
      fields[firstErrorName].scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    sessionStorage.setItem(storageKey, JSON.stringify(data));
    window.location.href = './result.html';
  });
})();
