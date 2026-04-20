document.addEventListener('DOMContentLoaded', () => {
    
    /* =========== Dark Mode Toggle =========== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check local storage or system preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }

    themeToggleBtn.addEventListener('click', () => {
        htmlElement.classList.toggle('dark');
        
        if (htmlElement.classList.contains('dark')) {
            localStorage.theme = 'dark';
        } else {
            localStorage.theme = 'light';
        }
    });

    /* =========== Hero Entrance Animation =========== */
    // Two rAF calls ensure layout is painted before animations start
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.body.classList.add('hero-animated');
        });
    });

    // Counter — starts after the social proof row fades in (~780ms delay)
    const counterEl = document.getElementById('hero-counter');
    if (counterEl) {
        setTimeout(() => {
            let count = 0;
            const target = 200;
            const duration = 900; // ms
            const step = target / (duration / 16);
            const tick = setInterval(() => {
                count = Math.min(count + step, target);
                counterEl.textContent = Math.floor(count) + '+';
                if (count >= target) clearInterval(tick);
            }, 16);
        }, 900);
    }

    /* =========== Custom Cursor =========== */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    // Only run if not on a touch device
    if (window.matchMedia("(pointer: fine)").matches) {
        
        let mouseX = 0, mouseY = 0;
        let outlineX = 0, outlineY = 0;
        
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Move dot instantly (transform-only via CSS variables)
            if (cursorDot) {
                cursorDot.style.setProperty('--cursor-x', `${mouseX}px`);
                cursorDot.style.setProperty('--cursor-y', `${mouseY}px`);
            }
        }, { passive: true });

        // Smooth outline follow
        const animateCursor = () => {
            if(cursorOutline) {
                outlineX += (mouseX - outlineX) * 0.2;
                outlineY += (mouseY - outlineY) * 0.2;

                // Smooth outline follow (transform-only via CSS variables)
                cursorOutline.style.setProperty('--cursor-x', `${outlineX}px`);
                cursorOutline.style.setProperty('--cursor-y', `${outlineY}px`);
            }
            requestAnimationFrame(animateCursor);
        };
        
        animateCursor();

        // Hover effects
        const hoverTriggers = document.querySelectorAll('.hover-trigger, a, button');
        hoverTriggers.forEach(trigger => {
            trigger.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
                if(trigger.classList.contains('magnetic-btn')) {
                    document.body.classList.add('cursor-hover-btn');
                }
            });
            trigger.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
                document.body.classList.remove('cursor-hover-btn');
            });
        });
        
        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            if(cursorDot) cursorDot.style.opacity = 0;
            if(cursorOutline) cursorOutline.style.opacity = 0;
        });
        document.addEventListener('mouseenter', () => {
            if(cursorDot) cursorDot.style.opacity = 1;
            if(cursorOutline) cursorOutline.style.opacity = 1;
        });
    }

    /* =========== Magnetic Buttons =========== */
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    
    if (window.matchMedia("(pointer: fine)").matches) {
        magneticBtns.forEach(btn => {
            let rect = null;
            let rafId = null;
            let lastClientX = 0;
            let lastClientY = 0;

            const schedule = () => {
                if (rafId) return;
                rafId = requestAnimationFrame(() => {
                    rafId = null;
                    rect = rect || btn.getBoundingClientRect();
                    const x = lastClientX - rect.left - rect.width / 2;
                    const y = lastClientY - rect.top - rect.height / 2;

                    const xMove = x * 0.3;
                    const yMove = y * 0.3;

                    btn.style.transform = `translate(${xMove}px, ${yMove}px) scale(1.05)`;
                });
            };

            btn.addEventListener('mouseenter', () => {
                rect = btn.getBoundingClientRect();
            });

            btn.addEventListener('mousemove', (e) => {
                lastClientX = e.clientX;
                lastClientY = e.clientY;
                schedule();
            }, { passive: true });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0px, 0px) scale(1)';
                rect = null;
            });
        });
    }

    /* =========== Scroll Reveal Observer =========== */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(element => {
        revealObserver.observe(element);
    });

    /* =========== Navbar Scroll Effect =========== */
    const navbar = document.getElementById('navbar');
    if (navbar) {
        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateNavbar = () => {
            ticking = false;
            if (lastScrollY > 50) {
                navbar.classList.add('scrolled');
                navbar.classList.add('py-2');
                navbar.classList.remove('py-4');
            } else {
                navbar.classList.remove('scrolled');
                navbar.classList.remove('py-2');
                navbar.classList.add('py-4');
            }
        };

        window.addEventListener('scroll', () => {
            lastScrollY = window.scrollY;
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(updateNavbar);
            }
        }, { passive: true });

        // Set initial state
        updateNavbar();
    }

    /* =========== Smooth Scroll for Anchor Links =========== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

});
