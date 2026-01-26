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
    // Detect pages that represent the case-studies listing so we can
    // force the breadcrumb visible even when the page does not include
    // the same section structure as the homepage (file:// paths included).
    const forceBreadcrumbVisible = (/case-studies/i).test(window.location.href) || document.title.toLowerCase().includes('case studies');
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
        
        // If we're on the case-studies listing (or other standalone pages)
        // force the breadcrumb to show and keep the label stable.
        if (forceBreadcrumbVisible) {
            breadcrumbSection.textContent = 'Case Studies';
            dynamicBreadcrumb.classList.add('visible');
            return;
        }

        // Update breadcrumb text normally for pages with sections
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
    window.addEventListener('scroll', () => {
        updateBreadcrumb();
        // keep breadcrumb background in sync with nav scrolled state
        if (window.scrollY > 50) {
            dynamicBreadcrumb.classList.add('scrolled');
        } else {
            dynamicBreadcrumb.classList.remove('scrolled');
        }
        // update nav active underline on scroll
        updateActiveNav();
    });
    // Update on page load
    window.addEventListener('load', () => {
        updateBreadcrumb();
        // set initial breadcrumb scrolled state on load
        if (window.scrollY > 50) dynamicBreadcrumb.classList.add('scrolled');
        // set initial nav active state
        updateActiveNav();
    });

    // Update active nav link based on current scroll position or page
    function updateActiveNav() {
        const navLinks = document.querySelectorAll('.nav-links a');
        // remove existing active
        navLinks.forEach(a => a.classList.remove('active'));

        // If this is a case-studies listing page, make the Cases link active
        if (forceBreadcrumbVisible) {
            for (const a of navLinks) {
                const href = a.getAttribute('href') || '';
                if (href.includes('case-studies')) {
                    a.classList.add('active');
                    return;
                }
            }
            return;
        }

        // Otherwise, find a link that matches the current section id (#about, #skills, etc.)
        const sections = document.querySelectorAll('section[id]');
        const NAV_OFFSET = 150;
        const scrollPosition = window.scrollY + NAV_OFFSET;

        // If we're at (or very near) the bottom of the document, treat Contact
        // as active. This ensures small pages or short final sections still
        // trigger the Contact underline.
        const nearBottom = (window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 20);
        if (nearBottom) {
            for (const a of navLinks) {
                const href = a.getAttribute('href') || '';
                if (href === '#contact') {
                    a.classList.add('active');
                    return;
                }
            }
        }
        // Choose the last section whose top is <= scrollPosition. This
        // handles short sections (like Contact) that are close together.
        let currentSection = null;
        let maxTop = -Infinity;
        sections.forEach(section => {
            const top = section.offsetTop;
            if (top <= scrollPosition && top > maxTop) {
                maxTop = top;
                currentSection = section.id;
            }
        });
        if (!currentSection) return;

        // find nav link with href matching `#${currentSection}` and mark active
        for (const a of navLinks) {
            const href = a.getAttribute('href') || '';
            if (href === `#${currentSection}`) {
                a.classList.add('active');
                return;
            }
        }
    }

    // Immediate active state on nav click (for faster feedback during smooth scroll)
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            // clear and set active to clicked link
            document.querySelectorAll('.nav-links a').forEach(x => x.classList.remove('active'));
            a.classList.add('active');
        });
    });

    // Ensure breadcrumb aligns with nav container on large screens
    function alignBreadcrumbToNav() {
        const breadcrumbInner = document.querySelector('.breadcrumb-inner');
        const navContainer = document.querySelector('nav.main-nav .container');
        if (!breadcrumbInner || !navContainer) return;
        // Apply only for desktop widths where we want pixel-perfect alignment
        if (window.innerWidth <= 1024) {
            // reset any inline styles on small screens
            breadcrumbInner.style.position = '';
            breadcrumbInner.style.left = '';
            breadcrumbInner.style.paddingLeft = '';
            breadcrumbInner.style.paddingRight = '';
            return;
        }
        const logo = document.querySelector('.logo');
        const navRect = navContainer.getBoundingClientRect();
        // place breadcrumb inner aligned directly under the logo (most robust)
        breadcrumbInner.style.position = 'absolute';
        // compute horizontal position and max width
        if (logo) {
            const logoRect = logo.getBoundingClientRect();
            breadcrumbInner.style.left = `${Math.round(logoRect.left)}px`;
            const maxW = Math.max(0, Math.round(navRect.right - logoRect.left));
            breadcrumbInner.style.maxWidth = `${maxW}px`;
        } else {
            breadcrumbInner.style.left = `${Math.round(navRect.left)}px`;
            breadcrumbInner.style.maxWidth = navContainer.offsetWidth + 'px';
        }
        // vertically center breadcrumbInner inside the fixed breadcrumb bar
        const breadcrumbBar = document.querySelector('.dynamic-breadcrumb');
        if (breadcrumbBar) {
            const barHeight = breadcrumbBar.clientHeight;
            const innerH = breadcrumbInner.offsetHeight;
            const topOffset = Math.max(0, Math.round((barHeight - innerH) / 2));
            breadcrumbInner.style.top = `${topOffset}px`;
        } else {
            breadcrumbInner.style.top = '';
        }
        breadcrumbInner.style.transform = 'none';
    }

    // Align on load and resize
    window.addEventListener('load', alignBreadcrumbToNav);
    window.addEventListener('resize', alignBreadcrumbToNav);
    // also run after a short delay to account for fonts/layout shifts
    setTimeout(alignBreadcrumbToNav, 250);
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

    // Garante que o menu mobile nunca inicie aberto (mesmo se o navegador restaurar o DOM)
    const navLinks = document.getElementById('primary-navigation');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (navLinks && mobileMenuToggle) {
        navLinks.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.setAttribute('aria-label', 'Open main menu');
    }
});

// Mobile menu toggle (keeps ARIA attributes in sync)
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.getElementById('primary-navigation');

if (mobileMenuToggle && navLinks) {
        // Garante que o menu nunca inicie aberto
        navLinks.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.setAttribute('aria-label', 'Open main menu');
    mobileMenuToggle.addEventListener('click', () => {
        const expanded = navLinks.classList.toggle('active');
        mobileMenuToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        mobileMenuToggle.setAttribute('aria-label', expanded ? 'Close main menu' : 'Open main menu');
        if (expanded) {
            navLinks.focus();
        }
    });

    // Fecha o menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (
            navLinks.classList.contains('active') &&
            !navLinks.contains(e.target) &&
            e.target !== mobileMenuToggle
        ) {
            navLinks.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileMenuToggle.setAttribute('aria-label', 'Open main menu');
        }
    });

    // Fecha o menu ao perder o foco (acessibilidade)
    navLinks.addEventListener('focusout', (e) => {
        // Se o novo foco não está dentro do menu
        if (!navLinks.contains(e.relatedTarget)) {
            navLinks.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileMenuToggle.setAttribute('aria-label', 'Open main menu');
        }
    });
}
