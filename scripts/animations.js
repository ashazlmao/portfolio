/*Hero headline word-by-word reveal*/
function initWordReveal() {
    const headline = document.querySelector('.hero-headline');
    if (!headline) return;

    const html = headline.innerHTML;
    const parts = html.split(/(<br>|<em>.*?<\/em>)/g);

    const rebuilt = parts.map(part => {
        if (part === '<br>') return '<br>';

        if (part.startsWith('<em>')) {
            const inner = part.replace(/<\/?em>/g, '');
            const words = inner.trim().split(' ').filter(Boolean);
            const wrapped = words.map(w =>
                `<span class="word-reveal-wrapper"><em class="word">${w}</em></span>`
            ).join(' ');
            return wrapped;
        }

        return part.trim().split(' ').filter(Boolean).map(w =>
            `<span class="word-reveal-wrapper"><span class="word">${w}</span></span>`
        ).join(' ');
    }).join('');

    headline.innerHTML = rebuilt;

    const words = headline.querySelectorAll('.word');
    words.forEach((word, i) => {
        setTimeout(() => {
            word.classList.add('visible');
        }, 120 + i * 65);
    });
}

/*Intersection Observer for scroll-triggered elements*/
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    const targets = document.querySelectorAll(
        '.section-header, .about-inner, .scarcity-bar, ' +
        '.faq-item, .cta-final-wrap, .fade-up, .divider-accent'
    );

    targets.forEach(el => observer.observe(el));
}

/*Staggered card entrances*/
function initStaggeredCards() {
    const grids = document.querySelectorAll(
        '.usp-grid, .ai-compare-grid, .commitments-grid'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const children = entry.target.querySelectorAll(
                    '.card, .ai-card-negative, .ai-card-positive'
                );
                children.forEach(child => child.classList.add('stagger-child'));

                requestAnimationFrame(() => {
                    children.forEach(child => child.classList.add('visible'));
                });

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.10,
        rootMargin: '0px 0px -30px 0px'
    });

    grids.forEach(grid => observer.observe(grid));
}

/*Step number count-in*/
function initStepReveal() {
    const stepItems = document.querySelectorAll('.step-item');
    if (!stepItems.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                const numEl = entry.target.querySelector('.step-number');
                if (!numEl) return;

                const target = parseInt(numEl.textContent.trim(), 10);
                let current = 0;
                const duration = 600;
                const startTime = performance.now();

                function tick(now) {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    current = Math.round(eased * target);
                    numEl.textContent = String(current).padStart(2, '0');
                    if (progress < 1) requestAnimationFrame(tick);
                }

                requestAnimationFrame(tick);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.25,
        rootMargin: '0px 0px -20px 0px'
    });

    stepItems.forEach(item => observer.observe(item));
}

/*Hero supporting elements staggered entrance*/
function initHeroSupportElements() {
    const elements = [
        document.querySelector('.hero-scarcity'),
        document.querySelector('.hero-eyebrow'),
        document.querySelector('.hero-divider'),
        document.querySelector('.hero-body'),
        document.querySelector('.hero-actions'),
        document.querySelector('.hero-meta'),
    ].filter(Boolean);

    elements.forEach(el => el.classList.add('fade-up'));

    elements.forEach((el, i) => {
        setTimeout(() => {
            el.classList.add('visible');
        }, 80 + i * 110);
    });
}

/*Init all*/
document.addEventListener('DOMContentLoaded', () => {
    initWordReveal();
    initHeroSupportElements();
    initScrollAnimations();
    initStaggeredCards();
    initStepReveal();
});
