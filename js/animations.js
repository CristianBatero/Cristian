// ============================================
// MINIMAL ANIMATIONS - SUBTLE & PROFESSIONAL
// ============================================

// Subtle developer-themed background
class DeveloperBackground {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.codeSnippets = [
            'function', 'const', 'let', 'class', 'import',
            'async', 'await', 'return', 'if', 'else',
            '{', '}', '()', '=>', '[]', '</>',
            'dev', 'code', 'app', 'web'
        ];
        this.init();
    }

    init() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '0';

        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.insertBefore(this.canvas, heroSection.firstChild);
            this.ctx = this.canvas.getContext('2d');
            this.resize();
            this.createParticles();
            this.animate();

            window.addEventListener('resize', () => this.resize());
        }
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    createParticles() {
        // Very few particles for subtle effect
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 30000);

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                text: this.codeSnippets[Math.floor(Math.random() * this.codeSnippets.length)],
                opacity: Math.random() * 0.15 + 0.05, // Very subtle
                size: Math.random() * 10 + 10,
                color: '#3b82f6' // Professional blue only
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((particle) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Wrap around screen
            if (particle.x < -50) particle.x = this.canvas.width + 50;
            if (particle.x > this.canvas.width + 50) particle.x = -50;
            if (particle.y < -50) particle.y = this.canvas.height + 50;
            if (particle.y > this.canvas.height + 50) particle.y = -50;

            // Draw particle
            this.ctx.font = `${particle.size}px 'Space Grotesk', monospace`;
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillText(particle.text, particle.x, particle.y);
        });

        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    }
}

class MinimalAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.initScrollAnimations();
        this.initHeaderScroll();
    }

    // Subtle fade-in on scroll
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all sections
        document.querySelectorAll('.section-container').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });
    }

    // Header scroll effect
    initHeaderScroll() {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            const header = document.querySelector('header');

            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    }
}

// ============================================
// INITIALIZE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    new DeveloperBackground();
    new MinimalAnimations();
    console.log('✓ Professional animations initialized');
});
