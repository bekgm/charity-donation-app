// Check if user is authenticated
const isAuthenticated = () => {
  return !!getToken() && !!getUser();
};

// Check if user has required role
const hasRole = (...roles) => {
  const user = getUser();
  return user && roles.includes(user.role);
};

// Redirect to login if not authenticated
const requireAuth = () => {
  if (!isAuthenticated()) {
    window.location.href = '/login.html';
    return false;
  }
  return true;
};

// Redirect to home if already authenticated
const requireGuest = () => {
  if (isAuthenticated()) {
    window.location.href = '/index.html';
    return false;
  }
  return true;
};

// Require specific roles
const requireRole = (...roles) => {
  if (!isAuthenticated()) {
    window.location.href = '/login.html';
    return false;
  }
  
  if (!hasRole(...roles)) {
    showAlert('You do not have permission to access this page', 'error');
    window.location.href = '/index.html';
    return false;
  }
  
  return true;
};

// Update navigation based on auth status
const updateNavigation = () => {
  const authLinks = document.getElementById('auth-links');
  const guestLinks = document.getElementById('guest-links');
  const userInfo = document.getElementById('user-info');
  
  if (isAuthenticated()) {
    const user = getUser();
    
    if (authLinks) authLinks.classList.remove('hidden');
    if (guestLinks) guestLinks.classList.add('hidden');
    if (userInfo) {
      userInfo.textContent = user.username;
      userInfo.classList.remove('hidden');
    }
    
    // Show admin link for admin users
    const adminLink = document.getElementById('admin-link');
    if (adminLink) {
      adminLink.classList.toggle('hidden', !hasRole('admin', 'moderator'));
    }
  } else {
    if (authLinks) authLinks.classList.add('hidden');
    if (guestLinks) guestLinks.classList.remove('hidden');
    if (userInfo) userInfo.classList.add('hidden');
  }
};

// Logout function
const logout = () => {
  authAPI.logout();
  showAlert('Logged out successfully', 'success');
  window.location.href = '/login.html';
};

// Initialize navigation on page load
document.addEventListener('DOMContentLoaded', updateNavigation);
