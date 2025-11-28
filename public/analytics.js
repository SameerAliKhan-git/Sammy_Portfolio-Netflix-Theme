class ActivityTracker {
    constructor() {
        this.endpoint = '/api/log-activity';
        this.init();
    }

    init() {
        // Track Page View
        this.logEvent('page_view', {
            url: window.location.href,
            referrer: document.referrer
        });

        // Track Section Views
        this.trackSections();

        // Track Clicks
        this.trackClicks();
    }

    async logEvent(eventType, details = {}) {
        try {
            await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    eventType,
                    details,
                    timestamp: new Date().toISOString()
                })
            });
        } catch (error) {
            console.error('Failed to log activity:', error);
        }
    }

    trackSections() {
        const sections = document.querySelectorAll('section[id]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    // Debounce slightly to avoid logging rapid scrolls
                    if (this.currentSection !== sectionId) {
                        this.currentSection = sectionId;
                        this.logEvent('section_view', { sectionId });
                    }
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => observer.observe(section));
    }

    trackClicks() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a, button');
            if (target) {
                const text = target.innerText || target.getAttribute('aria-label') || 'Unknown';
                const href = target.getAttribute('href');
                const id = target.getAttribute('id');
                
                this.logEvent('click', {
                    element: target.tagName,
                    text: text.substring(0, 50),
                    href,
                    id
                });
            }
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new ActivityTracker();
});
