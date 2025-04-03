// Set active nav link based on current page
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    const navContainer = document.querySelector('.nav-container');
    const navLinksContainer = document.querySelector('.nav-links');
    const scrollProgress = document.querySelector('.scroll-progress');
    
    // Set active nav link
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Add mobile menu button to navbar
    const menuBtn = document.createElement('button');
    menuBtn.className = 'menu-btn';
    menuBtn.innerHTML = '☰';
    menuBtn.setAttribute('aria-label', 'Toggle navigation menu');
    
    // Insert menu button after nav brand
    navContainer.insertBefore(menuBtn, navLinksContainer);
    
    // Toggle mobile menu
    menuBtn.addEventListener('click', () => {
        navLinksContainer.classList.toggle('show');
        menuBtn.innerHTML = navLinksContainer.classList.contains('show') ? '✕' : '☰';
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navLinksContainer.classList.contains('show')) {
            navLinksContainer.classList.remove('show');
            menuBtn.innerHTML = '☰';
        }
    });

    // Handle scroll effects
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = (currentScroll / totalScroll) * 100;
        
        // Update scroll progress
        scrollProgress.style.width = `${scrollPercentage}%`;
        
        // Update navbar style
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Handle search functionality
    const searchInput = document.querySelector('.nav-search input');
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                const searchTerm = e.target.value.trim();
                if (searchTerm) {
                    // Redirect to breeds page with search term
                    window.location.href = `/breeds.html?search=${encodeURIComponent(searchTerm)}`;
                }
            }
        });
    }
}); 