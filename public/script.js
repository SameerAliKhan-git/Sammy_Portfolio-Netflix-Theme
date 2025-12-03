/* ============================================
   SAMEER ALI KHAN - PREMIUM PORTFOLIO
   Interactive JavaScript
   ============================================ */
console.log('script.js v2.1.1 loaded');

// ============================================
// CUSTOM CURSOR
// ============================================
class CustomCursor {
    constructor() {
        this.cursor = document.querySelector('.cursor');
        this.follower = document.querySelector('.cursor-follower');
        this.links = document.querySelectorAll('a, button, input, textarea, .btn, .nav-link, .project-card, .skill-category, .contact-item');
        
        this.cursorX = 0;
        this.cursorY = 0;
        this.followerX = 0;
        this.followerY = 0;
        
        if (this.cursor && this.follower) {
            this.init();
        }
    }
    
    init() {
        // Mouse move
        document.addEventListener('mousemove', (e) => {
            this.cursorX = e.clientX;
            this.cursorY = e.clientY;
        });
        
        // Animate cursor
        this.animate();
        
        // Hover effects
        this.links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hover');
                this.follower.classList.add('hover');
            });
            
            link.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hover');
                this.follower.classList.remove('hover');
            });
        });
        
        // Click effects
        document.addEventListener('mousedown', () => {
            this.cursor.classList.add('active');
            this.follower.classList.add('active');
        });
        
        document.addEventListener('mouseup', () => {
            this.cursor.classList.remove('active');
            this.follower.classList.remove('active');
        });
    }
    
    animate() {
        // Smooth follower
        this.followerX += (this.cursorX - this.followerX) * 0.15;
        this.followerY += (this.cursorY - this.followerY) * 0.15;
        
        if (this.cursor) {
            this.cursor.style.left = this.cursorX + 'px';
            this.cursor.style.top = this.cursorY + 'px';
        }
        
        if (this.follower) {
            this.follower.style.left = this.followerX + 'px';
            this.follower.style.top = this.followerY + 'px';
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// LOADER
// ============================================
class Loader {
    constructor() {
        this.loader = document.querySelector('.loader');
        this.progress = document.querySelector('.loader-progress');
        this.percent = document.querySelector('.loader-percent');
        this.duration = 2500; // 2.5 seconds for loader sequence
        
        if (this.loader) {
            this.init();
        }
    }
    
    init() {
        // Force show loader
        // this.loader.classList.add('active');
        // this.loader.classList.remove('hidden');
        
        // Safety timeout to ensure loader hides
        setTimeout(() => {
            console.log('Loader safety timeout triggered');
            this.hide();
        }, this.duration + 1000);

        let startTime = null;
        
        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min((elapsed / this.duration) * 100, 100);
            
            if (this.progress) {
                this.progress.style.width = progress + '%';
            }
            
            if (this.percent) {
                this.percent.textContent = Math.floor(progress) + '%';
            }
            
            if (elapsed < this.duration) {
                requestAnimationFrame(animate);
            } else {
                setTimeout(() => this.hide(), 500);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    hide() {
        this.loader.classList.remove('active');
        this.loader.classList.add('hidden');
        document.body.style.overflow = 'auto';
        
        // Remove loader from DOM after animation
        setTimeout(() => {
            if (this.loader && this.loader.parentNode) {
                this.loader.remove();
            }
        }, 800);
    }
}

// ============================================
// TYPING EFFECT
// ============================================
class TypingEffect {
    constructor() {
        this.element = document.querySelector('.role-text');
        this.roles = [
            'Full Stack Developer',
            'Part-time Freelancer',
            'AI Enthusiast',
            'Finance Geek',
            'Crypto Enthusiast',
            'Fintech Enthusiast',
            'Aspiring Quant',
            'Cloud Enthusiast'
        ];
        this.currentRoleIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.typeSpeed = 100;
        this.deleteSpeed = 50;
        this.pauseTime = 2000;
        
        if (this.element) {
            this.init();
        }
    }
    
    init() {
        this.type();
    }
    
    type() {
        const currentRole = this.roles[this.currentRoleIndex];
        
        if (this.isDeleting) {
            this.currentCharIndex--;
        } else {
            this.currentCharIndex++;
        }
        
        this.element.textContent = currentRole.substring(0, this.currentCharIndex);
        
        let typeSpeed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;
        
        if (!this.isDeleting && this.currentCharIndex === currentRole.length) {
            typeSpeed = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentRoleIndex = (this.currentRoleIndex + 1) % this.roles.length;
            typeSpeed = 500;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

// ============================================
// STATS COUNTER
// ============================================
class StatsCounter {
    constructor() {
        this.stats = document.querySelectorAll('.stat-number');
        this.animated = false;
        
        if (this.stats.length > 0) {
            this.init();
        }
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated) {
                    this.animated = true;
                    this.animateStats();
                }
            });
        }, { threshold: 0.5 });
        
        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) {
            observer.observe(heroStats);
        }
    }
    
    animateStats() {
        this.stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(target * easeOutQuart);
                
                stat.textContent = current;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    stat.textContent = target;
                }
            };
            
            requestAnimationFrame(animate);
        });
    }
}

// ============================================
// NAVIGATION
// ============================================
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.toggle = document.querySelector('.nav-toggle');
        this.menu = document.querySelector('.nav-menu');
        this.links = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        // Scroll effect
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Mobile toggle
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleMenu());
        }
        
        // Close menu on link click
        this.links.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Active link on scroll
        window.addEventListener('scroll', () => this.updateActiveLink());
    }
    
    handleScroll() {
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }
    
    toggleMenu() {
        this.toggle.classList.toggle('active');
        this.menu.classList.toggle('active');
        document.body.style.overflow = this.menu.classList.contains('active') ? 'hidden' : '';
    }
    
    closeMenu() {
        this.toggle.classList.remove('active');
        this.menu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                this.links.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// ============================================
// SMOOTH SCROLL
// ============================================
class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.init();
    }
    
    init() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offsetTop = target.offsetTop - 80;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
}

// ============================================
// SKILL BARS ANIMATION
// ============================================
class SkillBars {
    constructor() {
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.animated = false;
        
        if (this.skillBars.length > 0) {
            this.init();
        }
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated) {
                    this.animated = true;
                    this.animateBars();
                }
            });
        }, { threshold: 0.2 });
        
        const skillsSection = document.querySelector('.skills');
        if (skillsSection) {
            observer.observe(skillsSection);
        }
    }
    
    animateBars() {
        this.skillBars.forEach((bar, index) => {
            const width = bar.getAttribute('data-width');
            setTimeout(() => {
                bar.style.width = width + '%';
            }, index * 100);
        });
    }
}

// ============================================
// TIMELINE ANIMATION
// ============================================
class Timeline {
    constructor() {
        this.timeline = document.querySelector('.timeline');
        this.progress = document.querySelector('.timeline-progress');
        
        if (this.timeline && this.progress) {
            this.init();
        }
    }
    
    init() {
        window.addEventListener('scroll', () => this.updateProgress());
    }
    
    updateProgress() {
        const timelineRect = this.timeline.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (timelineRect.top < windowHeight && timelineRect.bottom > 0) {
            const scrolled = (windowHeight - timelineRect.top) / (windowHeight + timelineRect.height);
            const progress = Math.min(Math.max(scrolled * 100, 0), 100);
            this.progress.style.height = progress + '%';
        }
    }
}

// ============================================
// TILT EFFECT
// ============================================
class TiltEffect {
    constructor() {
        this.elements = document.querySelectorAll('[data-tilt]');
        
        if (this.elements.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.elements.forEach(element => {
            element.addEventListener('mousemove', (e) => this.handleMove(e, element));
            element.addEventListener('mouseleave', (e) => this.handleLeave(e, element));
        });
    }
    
    handleMove(e, element) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    }
    
    handleLeave(e, element) {
        element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }
}

// ============================================
// SCROLL ANIMATIONS (AOS Alternative)
// ============================================
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[data-aos]');
        
        if (this.elements.length > 0) {
            this.init();
        }
    }
    
    init() {
        // Add initial styles
        this.elements.forEach(element => {
            // element.style.opacity = '0'; // Disabled to ensure visibility
            // element.style.transform = this.getInitialTransform(element);
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        
        // Create observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-aos-delay') || 0;
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) translateX(0)';
                    }, delay);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        this.elements.forEach(element => observer.observe(element));
    }
    
    getInitialTransform(element) {
        const animation = element.getAttribute('data-aos');
        
        switch (animation) {
            case 'fade-up':
                return 'translateY(30px)';
            case 'fade-down':
                return 'translateY(-30px)';
            case 'fade-left':
                return 'translateX(30px)';
            case 'fade-right':
                return 'translateX(-30px)';
            default:
                return 'translateY(30px)';
        }
    }
}

// ============================================
// BACK TO TOP
// ============================================
class BackToTop {
    constructor() {
        this.button = document.querySelector('.back-to-top');
        
        if (this.button) {
            this.init();
        }
    }
    
    init() {
        window.addEventListener('scroll', () => this.toggleVisibility());
        this.button.addEventListener('click', () => this.scrollToTop());
    }
    
    toggleVisibility() {
        if (window.scrollY > 500) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ============================================
// CONTACT FORM
// ============================================
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const submitBtn = this.form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Execute reCAPTCHA
            const token = await grecaptcha.execute('6LeraR0sAAAAAEXOwcly2wvYXOX6bSQngwswf0Un', {action: 'submit'});
            
            const formData = {
                name: this.form.querySelector('input[name="name"]').value,
                email: this.form.querySelector('input[name="email"]').value,
                subject: this.form.querySelector('input[name="subject"]').value,
                message: this.form.querySelector('textarea[name="message"]').value,
                recaptchaToken: token
            };
            
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                // Show in-place success message
                this.form.classList.add('success-state');
                this.form.reset();
                
                // Restore form after 7 seconds
                setTimeout(() => {
                    this.form.classList.remove('success-state');
                }, 7000);
            } else {
                this.showNotification(result.message || 'Failed to send message', 'error');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            this.showNotification('An error occurred. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    showNotification(message, type) {
        if (type === 'success') {
            const modal = document.createElement('div');
            modal.className = 'netflix-modal-overlay';
            modal.innerHTML = `
                <div class="netflix-modal">
                    <div class="modal-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3>Message Sent!</h3>
                    <p>${message}</p>
                    <button class="btn btn-netflix-primary" style="width: 100%; justify-content: center;" onclick="this.closest('.netflix-modal-overlay').remove()">OK</button>
                </div>
            `;
            document.body.appendChild(modal);
            
            // Close on click outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.remove();
            });
        } else {
            // Create notification element (Toast for errors)
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            `;
            
            // Add styles
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 30px;
                padding: 15px 25px;
                background: ${type === 'success' ? '#00d4aa' : '#E50914'};
                color: white;
                border-radius: 8px;
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 14px;
                font-weight: 500;
                z-index: 10000;
                animation: slideIn 0.3s ease;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            `;
            
            document.body.appendChild(notification);
            
            // Remove after 3 seconds
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    }
}

// ============================================
// MAGNETIC BUTTONS
// ============================================
class MagneticButtons {
    constructor() {
        this.buttons = document.querySelectorAll('.magnetic');
        
        if (this.buttons.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => this.handleMove(e, btn));
            btn.addEventListener('mouseleave', (e) => this.handleLeave(e, btn));
        });
    }
    
    handleMove(e, btn) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    }
    
    handleLeave(e, btn) {
        btn.style.transform = 'translate(0, 0)';
    }
}

// ============================================
// PARALLAX EFFECT
// ============================================
class Parallax {
    constructor() {
        this.shapes = document.querySelectorAll('.floating-shapes .shape');
        
        if (this.shapes.length > 0) {
            this.init();
        }
    }
    
    init() {
        window.addEventListener('scroll', () => this.handleScroll());
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }
    
    handleScroll() {
        const scrollY = window.scrollY;
        
        this.shapes.forEach((shape, index) => {
            const speed = 0.05 * (index + 1);
            shape.style.transform = `translateY(${scrollY * speed}px)`;
        });
    }
    
    handleMouseMove(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        this.shapes.forEach((shape, index) => {
            const speed = 10 * (index + 1);
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            shape.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
}

// ============================================
// SMOOTH REVEAL ON SCROLL
// ============================================
class SmoothReveal {
    constructor() {
        this.elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
        this.init();
    }
    
    init() {
        // Initial check
        this.checkElements();
        
        // Check on scroll with throttle
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.checkElements();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    checkElements() {
        this.elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top < windowHeight * 0.85) {
                el.classList.add('active');
            }
        });
    }
}

// ============================================
// TEXT SCRAMBLE EFFECT
// ============================================
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="scramble-char">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// ============================================
// SMOOTH COUNTER
// ============================================
class SmoothCounter {
    constructor() {
        this.counters = document.querySelectorAll('[data-count]');
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        this.counters.forEach(counter => observer.observe(counter));
    }
    
    animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 4000;
        const start = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutExpo = 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(target * easeOutExpo);
            
            el.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                el.textContent = target;
            }
        };
        
        requestAnimationFrame(updateCounter);
    }
}

// ============================================
// ADD NOTIFICATION ANIMATIONS
// ============================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .scramble-char {
        color: var(--primary);
    }
`;
document.head.appendChild(style);

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new Loader();       
    new CustomCursor(); 
    new Navigation();
    new SmoothScroll();
    new TypingEffect();
    new SmoothCounter();
    new SkillBars();
    new Timeline();
    new TiltEffect();
    new ScrollAnimations();
    new BackToTop();
    new ContactForm();
    new MagneticButtons();
    new Parallax();     
    new SmoothReveal();
    // new SmoothCounter(); // Removed to prevent conflict with StatsCounter
    
    const glitchEl = document.querySelector('.glitch');
    if (glitchEl) new TextScramble(glitchEl);
    
    // Initialize reveal after adding classes
    setTimeout(() => new SmoothReveal(), 100);

    // Initialize new features
    new Newsletter();
    new Guestbook();
    new VisitorStats();

    // Failsafe: Ensure loader is removed even if animation hangs
    setTimeout(() => {
        const loader = document.querySelector('.loader');
        if (loader && !loader.classList.contains('hidden')) {
            console.log('Failsafe: forcing loader hide');
            loader.classList.remove('active');
            loader.classList.add('hidden');
            setTimeout(() => loader.style.display = 'none', 500);
            document.body.style.overflow = 'auto';
        }
    }, 3500);
});

// ============================================
// NEWSLETTER
// ============================================
class Newsletter {
    constructor() {
        this.form = document.getElementById('newsletterForm');
        if (this.form) this.init();
    }

    init() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = this.form.querySelector('input[type="email"]');
            const submitBtn = this.form.querySelector('button');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            try {
                const res = await fetch('/api/newsletter', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: emailInput.value })
                });
                const data = await res.json();
                
                if (data.success) {
                    this.showNotification(data.message, 'success');
                    this.form.reset();
                } else {
                    this.showNotification(data.error, 'error');
                }
            } catch (err) {
                this.showNotification('Subscription failed. Try again.', 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    showNotification(msg, type) {
        // Reuse existing notification logic if available, or create simple alert
        const notif = document.createElement('div');
        notif.className = `notification ${type}`;
        notif.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; 
            padding: 15px 25px; border-radius: 8px; color: white;
            background: ${type === 'success' ? '#00d4aa' : '#E50914'};
            z-index: 10000; animation: slideIn 0.3s ease;
        `;
        notif.textContent = msg;
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 3000);
    }
}

// ============================================
// GUESTBOOK
// ============================================
class Guestbook {
    constructor() {
        this.container = document.getElementById('guestbook-entries');
        this.form = document.getElementById('guestbookForm');
        if (this.container || this.form) this.init();
    }

    init() {
        if (this.container) this.loadEntries();
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.submitEntry(e));
        }
    }

    async loadEntries() {
        try {
            const res = await fetch('/api/guestbook');
            const data = await res.json();
            if (data.success) {
                this.renderEntries(data.entries);
            }
        } catch (err) {
            console.error('Failed to load guestbook:', err);
        }
    }

    renderEntries(entries) {
        this.container.innerHTML = entries.map(entry => `
            <div class="guestbook-entry">
                <div class="entry-header">
                    <strong>${this.escapeHtml(entry.name)}</strong>
                    <span class="entry-date">${entry.date}</span>
                </div>
                <p>${this.escapeHtml(entry.message)}</p>
            </div>
        `).join('');
    }

    async submitEntry(e) {
        e.preventDefault();
        const formData = new FormData(this.form);
        const submitBtn = this.form.querySelector('button');
        submitBtn.disabled = true;

        try {
            const res = await fetch('/api/guestbook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.get('name'),
                    message: formData.get('message')
                })
            });
            const data = await res.json();

            if (data.success) {
                this.loadEntries(); // Reload entries
                this.form.reset();
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert('Failed to post entry.');
        } finally {
            submitBtn.disabled = false;
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ============================================
// VISITOR STATS
// ============================================
class VisitorStats {
    constructor() {
        this.el = document.getElementById('visitor-count');
        this.init();
    }

    async init() {
        // Log visit
        try {
            await fetch('/api/visit', { method: 'POST' });
            
            // Get stats if element exists
            if (this.el) {
                const res = await fetch('/api/stats');
                const data = await res.json();
                if (data.success) {
                    this.el.textContent = data.visitors.toLocaleString();
                }
            }
        } catch (err) {
            console.error('Visitor stats error:', err);
        }
    }
}

// ============================================
// PRELOAD FONTS
// ============================================
if ('fonts' in document) {
    Promise.all([
        document.fonts.load('400 1em Inter'),
        document.fonts.load('400 1em Bebas Neue')
    ]).then(() => {
        document.documentElement.classList.add('fonts-loaded');
    }).catch(e => {
        console.warn('Font loading failed:', e);
    });
}

// ============================================
// MOBILE NAVIGATION
// ============================================
class MobileNavigation {
    constructor() {
        this.navToggle = document.getElementById('navToggle');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        if (this.navToggle && this.navMenu) {
            this.init();
        }
    }
    
    init() {
        // Toggle Menu
        this.navToggle.addEventListener('click', () => {
            this.toggleMenu();
        });
        
        // Close menu when clicking a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.navMenu.classList.contains('active')) {
                    this.toggleMenu();
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.navMenu.classList.contains('active') && 
                !this.navMenu.contains(e.target) && 
                !this.navToggle.contains(e.target)) {
                this.toggleMenu();
            }
        });
    }
    
    toggleMenu() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');
        
        // Animate hamburger
        const hamburger = this.navToggle.querySelector('.hamburger');
        if (hamburger) {
            hamburger.classList.toggle('active');
        }
    }
}

// Initialize Mobile Navigation
document.addEventListener('DOMContentLoaded', () => {
    new MobileNavigation();
});
