/* PORTFOLIO CENTRAL COORDINATOR */

class PortfolioController {
    constructor() {
        this.theme = 'light';
        this.init();
    }

    init() {
        // 1. Theme Swapper Toggle
        this.setupThemeManager();

        // 2. Custom Interactive Cursor
        this.setupCustomCursor();

        // 3. Scroll Active Navigation Highlight
        this.setupScrollNavigation();

        // 4. Contact Form Handler
        this.setupContactForm();

        // 5. GSAP Entrance Animations
        this.setupScrollAnimations();

        // 6. Initialize Lucide Icons
        lucide.createIcons();
    }

    /* =========================================================================
       1. THEME SWAPPER (LIGHT / DARK)
       ========================================================================= */
    setupThemeManager() {
        const themeBtn = document.getElementById('theme-toggle-btn');
        if (!themeBtn) return;

        const updateToggleIcons = (theme) => {
            const moonIcon = themeBtn.querySelector('[data-lucide="moon"]');
            const sunIcon = themeBtn.querySelector('[data-lucide="sun"]');
            
            if (theme === 'dark') {
                if (moonIcon) moonIcon.style.display = 'none';
                if (sunIcon) sunIcon.style.display = 'block';
            } else {
                if (moonIcon) moonIcon.style.display = 'block';
                if (sunIcon) sunIcon.style.display = 'none';
            }
        };

        const setTheme = (themeName) => {
            document.documentElement.setAttribute('data-theme', themeName);
            this.theme = themeName;
            localStorage.setItem('safa_portfolio_theme', themeName);
            updateToggleIcons(themeName);
        };

        // Click handler
        themeBtn.addEventListener('click', () => {
            const nextTheme = this.theme === 'light' ? 'dark' : 'light';
            setTheme(nextTheme);
        });

        // Load saved theme
        const savedTheme = localStorage.getItem('safa_portfolio_theme') || 'light';
        setTheme(savedTheme);
    }

    /* =========================================================================
       2. CUSTOM INTERACTIVE CURSOR (GSAP DAMPED RING)
       ========================================================================= */
    setupCustomCursor() {
        const cursor = document.getElementById('custom-cursor');
        if (!cursor) return;

        const dot = cursor.querySelector('.cursor-dot');
        const ring = cursor.querySelector('.cursor-ring');
        
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        
        let ringX = mouseX;
        let ringY = mouseY;

        // Tracks mouse coordinates
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Move dot instantly
            gsap.set(dot, { x: mouseX, y: mouseY });
        });

        // Smoothly interpolates outer ring coordinates using GSAP ticker
        gsap.ticker.add(() => {
            const dampingFactor = 0.15; 
            ringX += (mouseX - ringX) * dampingFactor;
            ringY += (mouseY - ringY) * dampingFactor;
            
            gsap.set(ring, { x: ringX, y: ringY });
        });

        // Hover effect helper functions
        const setHoverState = (isHovering, dragMode = false) => {
            if (isHovering) {
                document.body.classList.add('cursor-hover');
                if (dragMode) {
                    document.body.classList.add('cursor-drag');
                }
            } else {
                document.body.classList.remove('cursor-hover');
                document.body.classList.remove('cursor-drag');
            }
        };

        // Attach mouse enter/leave listeners using delegation
        document.body.addEventListener('mouseenter', (e) => {
            const target = e.target;
            if (target.closest('a, button, .experience-row, .skill-card, input, textarea')) {
                const isDragElement = target.closest('.premium-card');
                setHoverState(true, isDragElement);
            }
        }, true);

        document.body.addEventListener('mouseleave', (e) => {
            const target = e.target;
            if (target.closest('a, button, .experience-row, .skill-card, input, textarea')) {
                setHoverState(false);
            }
        }, true);
    }

    /* =========================================================================
       3. INTERSECTION OBSERVER FOR ACTIVE NAV HIGHLIGHT
       ========================================================================= */
    setupScrollNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const observerOptions = {
            root: null,
            rootMargin: '-30% 0px -60% 0px', // Center viewport focus
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeId = entry.target.getAttribute('id');
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${activeId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        sections.forEach(section => observer.observe(section));

        // Smooth scroll for nav links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetEl = document.querySelector(targetId);
                
                if (targetEl) {
                    const offsetTop = targetEl.offsetTop - 80; // offset header height
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /* =========================================================================
       4. CONTACT FORM HANDLER WITH OVERLAY SUCCESS
       ========================================================================= */
    setupContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;

            // Form container visual transition
            const originalHTML = form.innerHTML;
            form.style.height = `${form.offsetHeight}px`; // maintain height to prevent layout shift
            form.innerHTML = `
                <div class="form-success-message">
                    <i data-lucide="check-circle" class="form-success-icon"></i>
                    <h3 class="form-success-title">Message Sent!</h3>
                    <p class="form-success-desc">
                        Thank you, <strong>${name}</strong>. I'll get back to you at <strong>${email}</strong> shortly.
                    </p>
                </div>
            `;
            lucide.createIcons();

            // Re-enable form inputs after 6 seconds
            setTimeout(() => {
                form.style.height = '';
                form.innerHTML = originalHTML;
                this.setupContactForm(); // re-bind listener
                lucide.createIcons();
            }, 6000);
        });
    }

    /* =========================================================================
       5. GSAP SCROLL-TRIGGERED ENTRANCE TRANSITIONS (inspired by kristi/tbh)
       ========================================================================= */
    setupScrollAnimations() {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // 1. Hero Section animations (runs instantly on load)
        gsap.from('.hero-title', {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: 'power3.out',
            delay: 0.2
        });

        gsap.from('.hero-bio', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power3.out',
            delay: 0.4
        });

        gsap.from('.hero-actions', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power3.out',
            delay: 0.5
        });


        // 2. Education section items slide in sequentially
        gsap.from('.education-item', {
            scrollTrigger: {
                trigger: '#education',
                start: 'top 75%'
            },
            opacity: 0,
            x: -20,
            duration: 0.8,
            stagger: 0.3,
            ease: 'power2.out'
        });

        // 3. Experience rows fade and lift on scroll
        gsap.from('.experience-row', {
            scrollTrigger: {
                trigger: '#experience',
                start: 'top 80%'
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out'
        });

        // 4. Competitions & Projects scroll entrance
        gsap.from('#projects .premium-card', {
            scrollTrigger: {
                trigger: '#projects',
                start: 'top 80%'
            },
            opacity: 0,
            x: -40,
            duration: 0.8,
            ease: 'power2.out'
        });

        gsap.from('#projects .education-item', {
            scrollTrigger: {
                trigger: '#projects',
                start: 'top 80%'
            },
            opacity: 0,
            x: 40,
            duration: 0.8,
            ease: 'power2.out'
        });

        // 5. Skills cards lift sequentially
        gsap.from('.skill-card', {
            scrollTrigger: {
                trigger: '#skills',
                start: 'top 80%'
            },
            opacity: 0,
            y: 40,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out'
        });

        // 5. Activities elements fade and stagger lift
        gsap.from('#activities div div', {
            scrollTrigger: {
                trigger: '#activities',
                start: 'top 85%'
            },
            opacity: 0,
            y: 20,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out'
        });

        // 6. Contact Section elements fade in
        gsap.from('.contact-info', {
            scrollTrigger: {
                trigger: '#contact',
                start: 'top 85%'
            },
            opacity: 0,
            x: -30,
            duration: 0.8,
            ease: 'power2.out'
        });

        gsap.from('.contact-form', {
            scrollTrigger: {
                trigger: '#contact',
                start: 'top 85%'
            },
            opacity: 0,
            x: 30,
            duration: 0.8,
            ease: 'power2.out'
        });
    }
}

// Instantiate Controller on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    window.PortfolioInstance = new PortfolioController();
});
