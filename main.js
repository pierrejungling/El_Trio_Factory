document.addEventListener('DOMContentLoaded', () => {
    // Menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Fermer le menu quand on clique sur un lien
        const navItems = document.querySelectorAll('.nav-links a');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        // Fermer le menu quand on clique en dehors
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && 
                !navLinks.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    // Scroll to top button
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Intersection Observer pour les animations
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

    // Observer les éléments à animer
    const animateElements = document.querySelectorAll('.introduction, .product-card, .about-section, .step');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Animation au scroll pour les sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Age gate popup
    if (document.body.dataset.ageGate === 'true') {
        const isVerified = localStorage.getItem('etf_age_verified') === 'true';
        if (!isVerified) {
            createAgeGate();
        }
    }

    function createAgeGate() {
        const overlay = document.createElement('div');
        overlay.className = 'age-gate-overlay';
        overlay.innerHTML = `
            <div class="age-gate-dialog">
                <img src="assets/logo-el-trio-factory.png" alt="El Trio Factory" class="age-gate-logo">
                <p class="age-gate-title">Avez-vous plus de 18 ans&nbsp;?</p>
                <p class="age-gate-description">La vente de boissons alcoolisées est interdite aux personnes de moins de 18 ans.</p>
                <button class="btn btn-primary age-gate-button">Oui, j'ai plus de 18 ans</button>
            </div>
        `;
        document.body.appendChild(overlay);

        requestAnimationFrame(() => {
            overlay.classList.add('visible');
        });

        const confirmButton = overlay.querySelector('.age-gate-button');
        confirmButton.addEventListener('click', () => {
            localStorage.setItem('etf_age_verified', 'true');
            overlay.classList.remove('visible');
            setTimeout(() => overlay.remove(), 400);
        });
    }
});

