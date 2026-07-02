(function () {
  const storageKey = 'loanApplyData';
  const resultContent = document.getElementById('resultContent');
  const emptyState = document.getElementById('emptyState');
  const backButton = document.getElementById('backButton');

  function parseData() {
    const rawData = sessionStorage.getItem(storageKey);
    if (!rawData) {
      return null;
    }

    try {
      return JSON.parse(rawData);
    } catch (error) {
      return null;
    }
  }

  function formatAmount(creditAmount) {
    const amountInYuan = Number(creditAmount) * 10000;
    return `${amountInYuan.toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} 元`;
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  }

  function isUsableData(data) {
    return data &&
      data.creditAmount &&
      data.companyName &&
      data.unifiedSocialCreditCode &&
      data.annualInterestRate &&
      data.applyDate &&
      data.repaymentMethod &&
      data.repaymentPeriod;
  }

  function showEmptyState() {
    resultContent.hidden = true;
    emptyState.hidden = false;
  }

  function render(data) {
    setText('creditAmountText', formatAmount(data.creditAmount));
    setText('companyNameText', data.companyName);
    setText('unifiedSocialCreditCodeText', data.unifiedSocialCreditCode);
    setText('annualInterestRateText', `${Number(data.annualInterestRate).toFixed(2)}%`);
    setText('applyDateText', data.applyDate);
    setText('repaymentMethodText', data.repaymentMethod);
    setText('repaymentPeriodText', data.repaymentPeriod);

    emptyState.hidden = true;
    resultContent.hidden = false;
  }

  backButton.addEventListener('click', function () {
    window.location.href = './index.html';
  });

  const data = parseData();
  if (!isUsableData(data)) {
    showEmptyState();
    return;
  }

  render(data);
})();
