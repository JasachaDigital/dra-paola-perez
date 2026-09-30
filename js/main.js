/* ============================================
   Dra. Paola Pérez - Medicina Estética Facial
   JavaScript compartido
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu ---
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => mobileMenu.classList.add('open'));
    }
    if (menuClose && mobileMenu) {
        menuClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
    }

    // --- Navbar shadow on scroll ---
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('shadow-md', window.scrollY > 20);
        }, { passive: true });
    }

    // --- Scroll Progress Bar ---
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgress.style.width = progress + '%';
        }, { passive: true });
    }

    // --- Back to Top Button ---
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 500);
        }, { passive: true });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Intersection Observer: Fade-in, Scale-in, Fade-in-left/right ---
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        animatedElements.forEach(el => observer.observe(el));
    }

    // --- Animated Counters ---
    const counters = document.querySelectorAll('[data-counter]');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.counted) {
                    entry.target.dataset.counted = 'true';
                    animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(el => counterObserver.observe(el));
    }

    function animateCounter(el) {
        const target = parseInt(el.dataset.counter, 10);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const duration = 1500;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out quad
            const eased = 1 - (1 - progress) * (1 - progress);
            const current = Math.round(eased * target);
            el.textContent = prefix + current + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    // --- Testimonial Slider ---
    const sliderTrack = document.querySelector('.testimonial-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dot');
    if (sliderTrack && slides.length > 1) {
        let currentSlide = 0;
        const totalSlides = slides.length;

        function goToSlide(index) {
            currentSlide = index;
            sliderTrack.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
        }

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => goToSlide(i));
        });

        // Auto-play
        let autoplay = setInterval(() => {
            goToSlide((currentSlide + 1) % totalSlides);
        }, 5000);

        // Pause on hover
        const slider = document.querySelector('.testimonial-slider');
        if (slider) {
            slider.addEventListener('mouseenter', () => clearInterval(autoplay));
            slider.addEventListener('mouseleave', () => {
                autoplay = setInterval(() => {
                    goToSlide((currentSlide + 1) % totalSlides);
                }, 5000);
            });
        }
    }

    // --- Image fallback handler ---
    document.querySelectorAll('img[data-fallback]').forEach(img => {
        img.addEventListener('error', function() {
            if (!this.dataset.failed) {
                this.dataset.failed = 'true';
                this.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.className = 'img-placeholder w-full h-full absolute inset-0';
                fallback.innerHTML = '<i class="fa-solid fa-spa text-4xl opacity-30"></i>';
                this.parentElement.style.position = 'relative';
                this.parentElement.appendChild(fallback);
            }
        });
    });

    // --- Parallax on hero images ---
    const parallaxElements = document.querySelectorAll('.parallax-img');
    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.speed) || 0.15;
                el.style.transform = `translateY(${scrollY * speed}px)`;
            });
        }, { passive: true });
    }

    // --- Smooth Reveal for Images ---
    const revealImages = document.querySelectorAll('.img-reveal');
    if (revealImages.length > 0) {
        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    const img = entry.target.querySelector('img');
                    if (img && img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                }
            });
        }, { threshold: 0.1 });
        revealImages.forEach(el => imgObserver.observe(el));
    }

    // --- WhatsApp button pulse ---
    const waButton = document.querySelector('a[aria-label="Contactar por WhatsApp"]');
    if (waButton) {
        setInterval(() => {
            waButton.classList.add('scale-110');
            setTimeout(() => waButton.classList.remove('scale-110'), 300);
        }, 8000);
    }

});
