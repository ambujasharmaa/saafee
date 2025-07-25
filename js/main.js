// Function to load HTML components
async function loadComponent(elementId, path) {
    try {
        const response = await fetch(path);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error(`Error loading component from ${path}:`, error);
    }
}

// Load header and footer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('header-container', '/components/header.html');
    loadComponent('footer-container', '/components/footer.html');
});

// Smooth scrolling for navigation links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Back to Top Button
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Video autoplay when in view
const video = document.querySelector('.works-video video');
let hasPlayed = false;

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !hasPlayed) {
            video.play();
            hasPlayed = true;
        } else if (!entry.isIntersecting && hasPlayed) {
            video.pause();
            video.currentTime = 0;
            hasPlayed = false;
        }
    });
}, {
    threshold: 0.5 // Trigger when 50% of the video is visible
});

if (video) {
    observer.observe(video);
}

document.addEventListener('DOMContentLoaded', function() {
    // Load footer component
    fetch('components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
        });

    // Section animations
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    waitForHeaderAndSetup();

    // Hero image carousel logic
    const carouselDots = document.querySelectorAll('.carousel-dot');
    const carouselImgs = document.querySelectorAll('.carousel-img');
    let carouselIndex = 0;
    let carouselInterval = null;

    function showCarouselImage(idx) {
        carouselImgs.forEach(img => img.classList.remove('active'));
        carouselDots.forEach(d => d.classList.remove('active'));
        carouselImgs[idx].classList.add('active');
        carouselDots[idx].classList.add('active');
        carouselIndex = idx;
    }

    carouselDots.forEach(dot => {
        dot.addEventListener('click', function() {
            const idx = parseInt(this.getAttribute('data-index'));
            showCarouselImage(idx);
            resetCarouselInterval();
        });
    });

    function nextCarouselImage() {
        let nextIdx = (carouselIndex + 1) % carouselImgs.length;
        showCarouselImage(nextIdx);
    }

    function startCarouselInterval() {
        carouselInterval = setInterval(nextCarouselImage, 4000);
    }

    function resetCarouselInterval() {
        clearInterval(carouselInterval);
        startCarouselInterval();
    }

    if (carouselImgs.length > 1) {
        startCarouselInterval();
    }

    // Mobile menu toggle logic
    function setupMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        const navLinks = document.querySelector('.nav-links');
        if (!mobileMenu || !navLinks) return;
        mobileMenu.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            navLinks.classList.toggle('open');
        });
        // Close menu when a nav link is clicked (for better UX)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 900) {
                    mobileMenu.classList.remove('active');
                    navLinks.classList.remove('open');
                }
            });
        });
    }
    // Wait for header to be loaded (since it's dynamic)
    function waitForHeaderAndMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        const navLinks = document.querySelector('.nav-links');
        if (mobileMenu && navLinks) {
            setupMobileMenu();
        } else {
            setTimeout(waitForHeaderAndMobileMenu, 100);
        }
    }
    waitForHeaderAndMobileMenu();
});

// Wait for DOM and header to be loaded
function setupHeaderHeroEffect() {
    const header = document.querySelector('.header');
    const heroSection = document.querySelector('.hero-section');
    if (!header || !heroSection) return;

    // Find the logo image
    function getLogoImg() {
        return header.querySelector('.logo img');
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const logoImg = getLogoImg();
            if (entry.isIntersecting) {
                header.classList.add('header-hero');
                if (logoImg) logoImg.src = 'images/Branding.svg';
            } else {
                header.classList.remove('header-hero');
                if (logoImg) logoImg.src = 'images/Saafe-Registered-logo-01.png';
            }
        });
    }, {
        threshold: 0.3 // 30% of hero in view
    });
    observer.observe(heroSection);

    // --- Fix: Immediately set header-hero if hero is already in view ---
    function isHeroInView() {
        const rect = heroSection.getBoundingClientRect();
        return (
            rect.top < window.innerHeight * 0.7 &&
            rect.bottom > window.innerHeight * 0.3
        );
    }
    const logoImg = getLogoImg();
    if (isHeroInView()) {
        header.classList.add('header-hero');
        if (logoImg) logoImg.src = 'images/Branding.svg';
    } else {
        header.classList.remove('header-hero');
        if (logoImg) logoImg.src = 'images/Saafe-Registered-logo-01.png';
    }
}

// If header is loaded dynamically, wait for it
function waitForHeaderAndSetup() {
    const header = document.querySelector('.header');
    if (header) {
        setupHeaderHeroEffect();
        setupDropdownMenu();
    } else {
        setTimeout(waitForHeaderAndSetup, 100);
    }
}

// Dropdown functionality for About Us in header
function setupDropdownMenu() {
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    if (!dropdownToggle || !dropdownMenu) return;

    dropdownToggle.addEventListener('click', function(e) {
        e.preventDefault();
        const isOpen = dropdownMenu.classList.contains('show');
        document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.remove('show'));
        document.querySelectorAll('.dropdown-toggle').forEach(toggle => toggle.classList.remove('active'));
        if (!isOpen) {
            dropdownMenu.classList.add('show');
            dropdownToggle.classList.add('active');
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!dropdownMenu.contains(e.target) && !dropdownToggle.contains(e.target)) {
            dropdownMenu.classList.remove('show');
            dropdownToggle.classList.remove('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', setupDropdownMenu); 