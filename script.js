// Smooth scrolling for navigation links
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

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Animate skill bars when in view
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillBars = entry.target.querySelectorAll('.skill-progress');
            skillBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width;
            });
        }
    });
}, observerOptions);

// Observe both content and dev skills sections
const contentSkillsSection = document.querySelector('.content-skills');
const devSkillsSection = document.querySelector('.dev-skills');

if (contentSkillsSection) {
    skillObserver.observe(contentSkillsSection);
}
if (devSkillsSection) {
    skillObserver.observe(devSkillsSection);
}

// Portfolio Carousel Functionality
class PortfolioCarousel {
    constructor(trackId, prevBtnId, nextBtnId, indicatorsId) {
        this.track = document.getElementById(trackId);
        this.prevBtn = document.getElementById(prevBtnId);
        this.nextBtn = document.getElementById(nextBtnId);
        this.indicators = document.getElementById(indicatorsId);
        
        if (!this.track) return;
        
        this.cards = this.track.querySelectorAll('.portfolio-card');
        this.currentIndex = 0;
        this.cardWidth = 370; // 350px + 20px gap
        this.visibleCards = this.getVisibleCards();
        
        this.init();
    }
    
    init() {
        this.createIndicators();
        this.updateCarousel();
        this.bindEvents();
        
        // Update on window resize
        window.addEventListener('resize', () => {
            this.visibleCards = this.getVisibleCards();
            this.updateCarousel();
        });
    }
    
    getVisibleCards() {
        const containerWidth = this.track.closest('.portfolio-carousel').offsetWidth;
        return Math.floor(containerWidth / this.cardWidth) || 1;
    }
    
    createIndicators() {
        if (!this.indicators) return;
        
        const totalSlides = Math.max(1, this.cards.length - this.visibleCards + 1);
        this.indicators.innerHTML = '';
        
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = `indicator-dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(i));
            this.indicators.appendChild(dot);
        }
    }
    
    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Touch/swipe support
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });
        
        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });
        
        this.track.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            
            const diff = startX - currentX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });
    }
    
    updateCarousel() {
        const maxIndex = Math.max(0, this.cards.length - this.visibleCards);
        this.currentIndex = Math.min(this.currentIndex, maxIndex);
        
        const translateX = -this.currentIndex * this.cardWidth;
        this.track.style.transform = `translateX(${translateX}px)`;
        
        // Update indicators
        if (this.indicators) {
            this.indicators.querySelectorAll('.indicator-dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
            });
        }
        
        // Update button states
        if (this.prevBtn) {
            this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
        }
        if (this.nextBtn) {
            this.nextBtn.style.opacity = this.currentIndex >= maxIndex ? '0.5' : '1';
        }
    }
    
    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
        }
    }
    
    nextSlide() {
        const maxIndex = Math.max(0, this.cards.length - this.visibleCards);
        if (this.currentIndex < maxIndex) {
            this.currentIndex++;
            this.updateCarousel();
        }
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }
}

// Initialize carousels when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Content Writer Carousel
    new PortfolioCarousel(
        'contentPortfolioTrack',
        'contentPrevBtn',
        'contentNextBtn',
        'contentCarouselIndicators'
    );
    
    // Web Developer Carousel
    new PortfolioCarousel(
        'devPortfolioTrack',
        'devPrevBtn',
        'devNextBtn',
        'devCarouselIndicators'
    );
});

// Fade in animation for sections
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Add fade-in class to elements and observe them
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in');
    fadeObserver.observe(section);
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add typing effect to hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 80);
        }, 500);
    }
});

// Add smooth reveal animation for portfolio items
const portfolioObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.portfolio-card').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'all 0.6s ease';
    portfolioObserver.observe(item);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});
