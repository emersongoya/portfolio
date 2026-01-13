// Navigation scroll effect
// NAV_HEIGHT should match --nav-height in styles.css
const nav = document.querySelector('nav.main-nav');
const NAV_HEIGHT = 80; // Fixed navigation height

if (nav) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

// Dynamic Breadcrumb Management
const dynamicBreadcrumb = document.getElementById('dynamicBreadcrumb');
const breadcrumbSection = document.getElementById('breadcrumbSection');

// Only initialize breadcrumb if elements exist
if (dynamicBreadcrumb && breadcrumbSection) {
    // Section name mapping
    const sectionNames = {
        'hero': 'Home',
        'about': 'About',
        'skills': 'Skills',
        'tools': 'Tools',
        'contact': 'Contact'
    };

    // Navigation offset constant for section detection
    // Larger than NAV_HEIGHT to account for breadcrumb and provide better UX
    // when determining which section is currently "active"
    const NAV_OFFSET = 150;

    // Track active section and update breadcrumb
    function updateBreadcrumb() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + NAV_OFFSET;
        
        let currentSection = 'hero';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.id;
            }
        });
        
        // Update breadcrumb text
        const sectionName = sectionNames[currentSection] || 'Home';
        breadcrumbSection.textContent = sectionName;
        
        // Show breadcrumb only if not on hero section
        if (currentSection === 'hero') {
            dynamicBreadcrumb.classList.remove('visible');
        } else {
            dynamicBreadcrumb.classList.add('visible');
        }
    }

    // Update breadcrumb on scroll
    window.addEventListener('scroll', updateBreadcrumb);
    // Update on page load
    window.addEventListener('load', updateBreadcrumb);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - NAV_HEIGHT; // Account for fixed nav
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections and cards
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const cards = document.querySelectorAll('.card');
    
    sections.forEach(section => observer.observe(section));
    cards.forEach(card => observer.observe(card));
});

// Mobile menu toggle (for future enhancement)
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}
