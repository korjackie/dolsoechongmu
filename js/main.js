document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Header
    const header = document.getElementById('header');

    // Scroll logic removed to keep header height fixed
    /*
    window.addEventListener('scroll', () => { ... });
    */

    // 2. Mobile Menu Toggle
    // Attempt to find existing button first
    let mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelector('.nav-links');

    if (!mobileMenuBtn) {
        // Fallback if not found in HTML
        mobileMenuBtn = document.createElement('div');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        // Insert before navLinks or adjust position as needed
        nav.insertBefore(mobileMenuBtn, navLinks);
    }

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // 3. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 4. Stats Counter Animation
    const statsSection = document.querySelector('.stats');
    const counters = document.querySelectorAll('.counter');
    let started = false;

    const startCount = (el) => {
        const target = +el.getAttribute('data-target');
        const count = +el.innerText.replace('+', '').replace('%', '');
        const duration = 2000; // 2 seconds
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (easeOutQuad) for natural feel
            const ease = 1 - (1 - progress) * (1 - progress);

            const current = Math.floor(ease * target);

            // Re-append suffix
            // Check original intent or sibling label
            const label = el.nextElementSibling.innerText;
            let suffix = '';
            if (label.includes('만족도')) suffix = '%';
            else if (label.includes('객실') || label.includes('고시원')) suffix = '+';

            el.innerText = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.innerText = target + suffix;
            }
        };

        requestAnimationFrame(update);
    };

    const onScroll = () => {
        if (!statsSection) return;
        const sectionPos = statsSection.getBoundingClientRect().top;
        const screenPos = window.innerHeight / 1.3;

        if (sectionPos < screenPos && !started) {
            started = true;
            counters.forEach(counter => {
                // reset to 0 first just in case
                counter.innerText = '0';
                startCount(counter);
            });
            // remove listener
            window.removeEventListener('scroll', onScroll);
        }
    };

    window.addEventListener('scroll', onScroll);
});
