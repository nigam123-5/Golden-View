document.addEventListener('DOMContentLoaded', function () {
    // Function to update the navbar authentication link
    function updateNavbar() {
        const navbarCollapse = document.getElementById('navbarCollapse');
        let authLink = document.getElementById('authLink');

        // Remove existing auth link if present
        if (authLink) {
            authLink.remove();
        }

        const token = localStorage.getItem('token');

        // Create new auth link element
        authLink = document.createElement('a');
        authLink.className = 'right';
        authLink.id = 'authLink';

        if (token) {
            // User is logged in - show Logout
            authLink.href = '/';
            authLink.textContent = 'Logout';
            authLink.addEventListener('click', function (e) {
                e.preventDefault();
                localStorage.removeItem('token');
                updateNavbar();
                window.location.href = '/';
            });
        } else {
            // User is not logged in - show Sign In
            authLink.href = '/login';
            authLink.textContent = 'Sign In';
        }

        // Append the auth link to the navbar
        navbarCollapse.appendChild(authLink);
    }

    // Initial navbar update on page load
    updateNavbar();
});
