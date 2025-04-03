// Authentication related functions

// Check if user is authenticated
function isAuthenticated() {
    return sessionStorage.getItem('authenticated') === 'true';
}

// Redirect to login page if not authenticated
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/login.html';
    }
}

// Handle logout
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

// Logout function
function logout() {
    sessionStorage.removeItem('authenticated');
    window.location.href = '/login.html';
}

// Run authentication check on page load
document.addEventListener('DOMContentLoaded', function() {
    requireAuth();
    setupLogout();
}); 