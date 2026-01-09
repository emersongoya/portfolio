// Professional Dark Mode Portfolio - Interactions & Animations

document.addEventListener('DOMContentLoaded', function() {
    
    // Navigation scroll effect
    const nav = document.querySelector('nav');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections
    document.querySelectorAll('.card, section').forEach(element => {
        observer.observe(element);
    });
    
    // Add gradient animation to hero title
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        setInterval(() => {
            heroTitle.style.animation = 'none';
            setTimeout(() => {
                heroTitle.style.animation = 'fadeInUp 1s ease-out';
            }, 10);
        }, 5000);
    }
    
});
