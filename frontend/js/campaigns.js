let allCampaigns = [];

// Load campaigns
const loadCampaigns = async (filters = {}) => {
  const campaignsContainer = document.getElementById('campaigns-container');
  
  try {
    campaignsContainer.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading campaigns...</p></div>';
    
    const data = await campaignAPI.getAll(filters);
    allCampaigns = data.campaigns;
    
    if (allCampaigns.length === 0) {
      campaignsContainer.innerHTML = '<p class="text-center">No campaigns found.</p>';
      return;
    }
    
    campaignsContainer.innerHTML = allCampaigns.map(campaign => createCampaignCard(campaign)).join('');
  } catch (error) {
    campaignsContainer.innerHTML = `<p class="text-center alert alert-error">${error.message}</p>`;
  }
};

// Create campaign card HTML
const createCampaignCard = (campaign) => {
  const percentage = Math.min(Math.round((campaign.currentAmount / campaign.goalAmount) * 100), 100);
  const daysLeft = Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24));
  
  return `
    <div class="campaign-card">
      <img src="${campaign.imageUrl}" alt="${campaign.title}">
      <div class="campaign-card-body">
        <span class="category">${campaign.category}</span>
        <h3>${campaign.title}</h3>
        <p>${campaign.description.substring(0, 120)}...</p>
        
        <div class="progress-bar">
          <div class="progress-bar-fill" style="width: ${percentage}%"></div>
        </div>
        
        <div class="campaign-stats">
          <div>
            <strong>${formatCurrency(campaign.currentAmount)}</strong>
            <small>raised of ${formatCurrency(campaign.goalAmount)}</small>
          </div>
          <div>
            <strong>${percentage}%</strong>
          </div>
        </div>
        
        <div class="campaign-stats">
          <small>${daysLeft > 0 ? daysLeft + ' days left' : 'Ended'}</small>
          <small>Status: ${campaign.status}</small>
        </div>
        
        <button class="btn btn-primary" onclick="viewCampaign('${campaign._id}')" style="width: 100%; margin-top: 1rem;">
          View Campaign
        </button>
      </div>
    </div>
  `;
};

// View campaign details
const viewCampaign = (id) => {
  window.location.href = `/campaign-details.html?id=${id}`;
};

// Filter campaigns
const filterCampaigns = () => {
  const category = document.getElementById('category-filter')?.value;
  const status = document.getElementById('status-filter')?.value;
  
  const filters = {};
  if (category) filters.category = category;
  if (status) filters.status = status;
  
  loadCampaigns(filters);
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadCampaigns();
  
  // Add filter listeners
  const categoryFilter = document.getElementById('category-filter');
  const statusFilter = document.getElementById('status-filter');
  
  if (categoryFilter) categoryFilter.addEventListener('change', filterCampaigns);
  if (statusFilter) statusFilter.addEventListener('change', filterCampaigns);
});
