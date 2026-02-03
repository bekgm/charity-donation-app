document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const campaignId = params.get('id');

  if (!campaignId) {
    showAlert('Campaign not found', 'error');
    return;
  }

  // Загрузка кампании
  const loadCampaign = async () => {
    const data = await campaignAPI.getById(campaignId);
    const c = data.campaign || data;

    document.getElementById('campaign-title').textContent = c.title;
    document.getElementById('campaign-description').textContent = c.description;
    document.getElementById('campaign-category').textContent = c.category;
    document.getElementById('campaign-status').textContent = c.status;
    document.getElementById('campaign-end-date').textContent = formatDate(c.endDate);
    document.getElementById('campaign-goal').textContent = formatCurrency(c.goalAmount);
    document.getElementById('campaign-raised').textContent = formatCurrency(c.currentAmount);
  };

  await loadCampaign();
  updateNavigation();

  // DONATE
  document.getElementById('donate-btn').addEventListener('click', async () => {
    if (!isAuthenticated()) {
      showAlert('Please login to donate', 'error');
      window.location.href = '/login.html';
      return;
    }

    const amount = prompt('Enter donation amount');

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      showAlert('Invalid amount', 'error');
      return;
    }

    try {
     await donationAPI.create({
  campaign: campaignId,   // 👈 ВАЖНО: имя поля
  amount: Number(amount),
});


      showAlert('Thank you for your donation!', 'success');
      await loadCampaign(); // обновляем цифры без перезагрузки

    } catch (error) {
      showAlert(error.message, 'error');
    }
  });
});
