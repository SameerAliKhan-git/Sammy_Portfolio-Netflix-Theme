
class NetflixHover {
    constructor() {
        this.cards = document.querySelectorAll('.section.projects .netflix-card');
        this.backdrop = document.createElement('div');
        this.backdrop.className = 'card-backdrop';
        document.body.appendChild(this.backdrop);
        this.activeClone = null;
        this.hoverTimeout = null;
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => this.handleMouseEnter(e, card));
            card.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, card));
        });
    }

    handleMouseEnter(e, card) {
        if (this.activeClone) return; // Already expanded

        this.hoverTimeout = setTimeout(() => {
            this.expandCard(card);
        }, 500); // 0.5s delay before expanding
    }

    handleMouseLeave(e, card) {
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
            this.hoverTimeout = null;
        }
    }

    expandCard(originalCard) {
        // Get position
        const rect = originalCard.getBoundingClientRect();

        // Create clone
        const clone = originalCard.cloneNode(true);
        this.activeClone = clone;

        // Style clone to match original position initially
        clone.style.position = 'fixed';
        clone.style.top = `${rect.top}px`;
        clone.style.left = `${rect.left}px`;
        clone.style.width = `${rect.width}px`;
        clone.style.height = `${rect.height}px`;
        clone.style.margin = '0';
        clone.style.zIndex = '10000';
        clone.style.transition = 'all 0.4s cubic-bezier(0.5, 0, 0.1, 1)';
        
        // Remove hover transform from clone initially to prevent double scaling
        clone.style.transform = 'none';

        document.body.appendChild(clone);
        this.backdrop.classList.add('active');

        // Force reflow
        clone.offsetHeight;

        // Add expanded class to animate to center
        requestAnimationFrame(() => {
            clone.classList.add('expanded');
            // Clear inline styles that conflict with class (except position fixed)
            clone.style.top = '50%';
            clone.style.left = '50%';
            clone.style.width = '75vw';
            clone.style.height = '75vh';
            clone.style.transform = 'translate(-50%, -50%)';
        });

        // Handle mouse leave on clone
        clone.addEventListener('mouseleave', () => this.closeCard(originalCard));
    }

    closeCard(originalCard) {
        if (!this.activeClone) return;

        const clone = this.activeClone;
        const rect = originalCard.getBoundingClientRect();

        // Animate back
        clone.classList.remove('expanded');
        clone.style.top = `${rect.top}px`;
        clone.style.left = `${rect.left}px`;
        clone.style.width = `${rect.width}px`;
        clone.style.height = `${rect.height}px`;
        clone.style.transform = 'none';
        
        this.backdrop.classList.remove('active');

        // Remove after animation
        setTimeout(() => {
            if (clone.parentNode) {
                clone.parentNode.removeChild(clone);
            }
            this.activeClone = null;
        }, 400);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new NetflixHover();
});
