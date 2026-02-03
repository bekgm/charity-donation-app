// Login handler
const handleLogin = async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const submitBtn = e.target.querySelector('button[type="submit"]');
  
  try {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';
    
    const data = await authAPI.login({ email, password });
    
    setToken(data.token);
    setUser(data.user);
    
    showAlert('Login successful!', 'success');
    
    // Redirect based on role
    if (data.user.role === 'admin' || data.user.role === 'moderator') {
      window.location.href = '/admin.html';
    } else {
      window.location.href = '/dashboard.html';
    }
  } catch (error) {
    showAlert(error.message, 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Login';
  }
};

// Register handler
const handleRegister = async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const submitBtn = e.target.querySelector('button[type="submit"]');
  
  if (password !== confirmPassword) {
    showAlert('Passwords do not match', 'error');
    return;
  }
  
  try {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';
    
    const data = await authAPI.register({ username, email, password });
    
    setToken(data.token);
    setUser(data.user);
    
    showAlert('Registration successful! Welcome!', 'success');
    window.location.href = '/dashboard.html';
  } catch (error) {
    showAlert(error.message, 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Register';
  }
};

// Initialize forms
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
});
