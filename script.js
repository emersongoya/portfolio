// Navigation scroll effect
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Dynamic Breadcrumb Management
const dynamicBreadcrumb = document.getElementById('dynamicBreadcrumb');
const breadcrumbSection = document.getElementById('breadcrumbSection');

// Section name mapping
const sectionNames = {
    'hero': 'Home',
    'about': 'About',
    'skills': 'Skills',
    'tools': 'Tools',
    'contact': 'Contact'
};

// Track active section and update breadcrumb
function updateBreadcrumb() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 150; // Offset for fixed nav
    
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

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed nav
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
