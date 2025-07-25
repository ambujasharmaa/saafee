// Back to Top Button Functionality
class BackToTop {
    constructor() {
        this.button = null;
        this.scrollThreshold = 300;
        this.init();
    }

    init() {
        // Create button element
        this.button = document.createElement('button');
        this.button.id = 'backToTop';
        this.button.className = 'back-to-top';
        this.button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        
        // Add button to body
        document.body.appendChild(this.button);

        // Add event listeners
        this.addEventListeners();
    }

    addEventListeners() {
        // Scroll event
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > this.scrollThreshold) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        });

        // Click event
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Initialize Back to Top functionality
document.addEventListener('DOMContentLoaded', () => {
    new BackToTop();
}); 