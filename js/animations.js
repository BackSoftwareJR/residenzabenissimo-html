document.addEventListener('DOMContentLoaded', function() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animatedSelectors = [
        '.fade-in-up',
        '.fade-in-left',
        '.fade-in-right',
        '.schedule-item',
        '.why-card',
        '.testimonial-card',
        '.step-card'
    ].join(', ');

    const sectionSelectors = [
        '.schedule-section',
        '.why-section',
        '.testimonials-section',
        '.steps-section'
    ].join(', ');

    function revealElement(element) {
        if (!element.classList.contains('animate')) {
            element.classList.add('animate');
        }
    }

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        document.querySelectorAll(animatedSelectors).forEach(revealElement);
        document.querySelectorAll(sectionSelectors).forEach(function(section) {
            section.classList.add('is-visible');
        });
        return;
    }

    const elementObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                revealElement(entry.target);
                elementObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.12
    });

    document.querySelectorAll(animatedSelectors).forEach(function(element) {
        elementObserver.observe(element);
    });

    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -5% 0px',
        threshold: 0.1
    });

    document.querySelectorAll(sectionSelectors).forEach(function(section) {
        sectionObserver.observe(section);
    });

    // Evidenzia voce menu attiva allo scroll
    const navLinks = document.querySelectorAll('.sidebar-nav a[href^="#"]');
    const sections = Array.from(navLinks)
        .map(function(link) {
            const id = link.getAttribute('href').slice(1);
            const section = document.getElementById(id);
            return section ? { link: link, section: section } : null;
        })
        .filter(Boolean);

    if (sections.length) {
        const navObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    navLinks.forEach(function(l) { l.classList.remove('active'); });
                    const match = sections.find(function(s) { return s.section === entry.target; });
                    if (match) match.link.classList.add('active');
                }
            });
        }, {
            root: null,
            rootMargin: '-40% 0px -50% 0px',
            threshold: 0
        });

        sections.forEach(function(item) {
            navObserver.observe(item.section);
        });
    }
});
