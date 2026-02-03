// Load user donations
const loadUserDonations = async () => {
  const donationsContainer = document.getElementById('donations-container');
  
  try {
    donationsContainer.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading donations...</p></div>';
    
    const data = await donationAPI.getAll();
    
    if (data.donations.length === 0) {
      donationsContainer.innerHTML = '<p class="text-center">You haven\'t made any donations yet.</p>';
      return;
    }
    
    const tableHTML = `
      <table>
        <thead>
          <tr>
            <th>Campaign</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          ${data.donations.map(donation => `
            <tr>
              <td>${donation.campaign.title}</td>
              <td><strong>${formatCurrency(donation.amount)}</strong></td>
              <td>${formatDate(donation.createdAt)}</td>
              <td><span class="badge badge-${donation.status}">${donation.status}</span></td>
              <td>${donation.campaign.category}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    donationsContainer.innerHTML = tableHTML;
    
    // Calculate total donated
    const total = data.donations.reduce((sum, d) => sum + d.amount, 0);
    const totalEl = document.getElementById('total-donated');
    if (totalEl) {
      totalEl.textContent = formatCurrency(total);
    }
  } catch (error) {
    donationsContainer.innerHTML = `<p class="text-center alert alert-error">${error.message}</p>`;
  }
};

// Make a donation
const makeDonation = async (e) => {
  e.preventDefault();
  
  const amount = parseFloat(document.getElementById('amount').value);
  const campaign = document.getElementById('campaign-select').value;
  const message = document.getElementById('message').value;
  const isAnonymous = document.getElementById('anonymous').checked;
  const submitBtn = e.target.querySelector('button[type="submit"]');
  
  try {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
    
    await donationAPI.create({
      amount,
      campaign,
      message,
      isAnonymous,
    });
    
    showAlert('Thank you for your donation!', 'success');
    
    // Reset form
    e.target.reset();
    
    // Close modal if exists
    const modal = document.getElementById('donation-modal');
    if (modal) modal.classList.remove('active');
    
    // Reload donations if on dashboard
    if (typeof loadUserDonations === 'function') {
      loadUserDonations();
    }
    
  } catch (error) {
    showAlert(error.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Donate Now';
  }
};

// Load campaign donations (for campaign details page)
const loadCampaignDonations = async (campaignId) => {
  const donationsContainer = document.getElementById('campaign-donations');
  
  try {
    const data = await donationAPI.getByCampaign(campaignId);
    
    if (data.donations.length === 0) {
      donationsContainer.innerHTML = '<p class="text-center">No donations yet. Be the first to donate!</p>';
      return;
    }
    
    donationsContainer.innerHTML = data.donations.map(donation => `
      <div class="card">
        <p><strong>${donation.donor.username}</strong> donated <strong>${formatCurrency(donation.amount)}</strong></p>
        ${donation.message ? `<p><em>"${donation.message}"</em></p>` : ''}
        <small>${formatDate(donation.createdAt)}</small>
      </div>
    `).join('');
  } catch (error) {
    donationsContainer.innerHTML = `<p class="alert alert-error">${error.message}</p>`;
  }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  const donationForm = document.getElementById('donation-form');
  if (donationForm) {
    donationForm.addEventListener('submit', makeDonation);
  }
  
  // Load user donations on dashboard
  if (document.getElementById('donations-container')) {
    requireAuth();
    loadUserDonations();
  }
});
