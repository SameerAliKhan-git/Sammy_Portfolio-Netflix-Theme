
// ============================================
// MOBILE CARD OBSERVER
// ============================================
class MobileCardObserver {
    constructor() {
        this.cards = document.querySelectorAll('.netflix-card');
        this.isMobile = window.innerWidth <= 768;
        
        if (this.cards.length > 0 && this.isMobile) {
            this.init();
        }

        // Re-check on resize
        window.addEventListener('resize', () => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 768;
            
            if (this.isMobile && !wasMobile) {
                this.init();
            } else if (!this.isMobile && wasMobile) {
                this.disconnect();
            }
        });
    }
    
    init() {
        // Create observer with center viewport focus
        // rootMargin: -40% from top and bottom creates a 20% height active area in the center
        const options = {
            root: null,
            rootMargin: '-40% 0px -40% 0px',
            threshold: 0
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Card is in the center "focus" area
                    entry.target.classList.add('mobile-active');
                } else {
                    // Card has left the center area
                    entry.target.classList.remove('mobile-active');
                }
            });
        }, options);
        
        this.cards.forEach(card => this.observer.observe(card));
    }

    disconnect() {
        if (this.observer) {
            this.observer.disconnect();
            this.cards.forEach(card => card.classList.remove('mobile-active'));
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new MobileCardObserver();
});
