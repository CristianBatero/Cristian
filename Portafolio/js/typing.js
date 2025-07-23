// ======================================
// TYPING ANIMATION SCRIPT
// ======================================

// Wait for DOM and Typed.js to load
document.addEventListener('DOMContentLoaded', function() {
    // Check if Typed.js is loaded
    if (typeof Typed !== 'undefined') {
        initializeTypedAnimation();
    } else {
        // Fallback if Typed.js doesn't load
        console.warn('Typed.js not loaded, using fallback animation');
        initializeFallbackAnimation();
    }
});

// Initialize Typed.js animation
function initializeTypedAnimation() {
    const typedElement = document.getElementById('typed');
    
    if (!typedElement) {
        console.warn('Typed element not found');
        return;
    }

    // Configuration for typing animation
    const typedConfig = {
        strings: [
            'Desarrollador Java',
            'Programador Python', 
            'Desarrollador Web',
            'Especialista en Redes',
            'Solucionador de Problemas'
        ],
        typeSpeed: 100,           // Speed of typing
        backSpeed: 50,            // Speed of backspacing
        backDelay: 2000,          // Delay before backspacing
        startDelay: 1000,         // Delay before starting
        loop: true,               // Loop the animation
        showCursor: true,         // Show blinking cursor
        cursorChar: '|',          // Cursor character
        autoInsertCss: true,      // Insert CSS automatically
        fadeOut: false,           // Don't fade out
        fadeOutClass: 'typed-fade-out',
        fadeOutDelay: 500,        // Fade out delay
        onComplete: function(self) {
            // Animation completed
            console.log('Typing animation completed');
        },
        onStart: function(arrayPos, self) {
            // Animation started
            console.log('Typing animation started');
        },
        onStop: function(arrayPos, self) {
            // Animation stopped
            console.log('Typing animation stopped');
        },
        onTypingPaused: function(arrayPos, self) {
            // Typing paused
        },
        onTypingResumed: function(arrayPos, self) {
            // Typing resumed
        },
        onDestroy: function(self) {
            // Animation destroyed
            console.log('Typing animation destroyed');
        }
    };

    // Initialize Typed.js
    try {
        const typed = new Typed('#typed', typedConfig);
        
        // Store reference for potential cleanup
        window.typedInstance = typed;
        
        // Handle visibility change to pause/resume animation
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                if (typed && typeof typed.stop === 'function') {
                    typed.stop();
                }
            } else {
                if (typed && typeof typed.start === 'function') {
                    typed.start();
                }
            }
        });
        
    } catch (error) {
        console.error('Error initializing Typed.js:', error);
        initializeFallbackAnimation();
    }
}

// Fallback animation if Typed.js fails to load
function initializeFallbackAnimation() {
    const typedElement = document.getElementById('typed');
    
    if (!typedElement) {
        return;
    }

    const texts = [
        'Desarrollador Java',
        'Programador Python',
        'Desarrollador Web',
        'Especialista en Redes',
        'Solucionador de Problemas'
    ];
    
    let currentIndex = 0;
    let currentText = '';
    let isDeleting = false;
    let charIndex = 0;

// sourcery skip: avoid-function-declarations-in-blocks
    function typeWriter() {
        const fullText = texts[currentIndex];
        
        if (isDeleting) {
            currentText = fullText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            currentText = fullText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        typedElement.textContent = currentText;
        
        // Add cursor
        if (!isDeleting && charIndex === fullText.length) {
            typedElement.innerHTML = currentText + '<span class="cursor">|</span>';
        } else if (isDeleting && charIndex === 0) {
            typedElement.innerHTML = currentText + '<span class="cursor">|</span>';
        } else {
            typedElement.innerHTML = currentText + '<span class="cursor">|</span>';
        }
        
        let typeSpeed = 100;
        
        if (isDeleting) {
            typeSpeed = 50;
        }
        
        if (!isDeleting && charIndex === fullText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            currentIndex = (currentIndex + 1) % texts.length;
            typeSpeed = 500; // Pause before next word
        }
        
        setTimeout(typeWriter, typeSpeed);
    }
    
    // Add CSS for cursor animation
    if (!document.querySelector('#cursor-style')) {
        const style = document.createElement('style');
        style.id = 'cursor-style';
        style.textContent = `
            .cursor {
                animation: blink 1s infinite;
            }
            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Start the animation
    typeWriter();
}

// Utility function to restart typing animation
function restartTypingAnimation() {
    if (window.typedInstance && typeof window.typedInstance.destroy === 'function') {
        window.typedInstance.destroy();
    }
    
    // Small delay before restarting
    setTimeout(() => {
        initializeTypedAnimation();
    }, 100);
}

// Utility function to stop typing animation
function stopTypingAnimation() {
    if (window.typedInstance && typeof window.typedInstance.destroy === 'function') {
        window.typedInstance.destroy();
        window.typedInstance = null;
    }
}

// Handle page lifecycle events
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, pause animations
        if (window.typedInstance && typeof window.typedInstance.stop === 'function') {
            window.typedInstance.stop();
        }
    } else {
        // Page is visible, resume animations
        if (window.typedInstance && typeof window.typedInstance.start === 'function') {
            window.typedInstance.start();
        }
    }
});

// Handle window focus events
window.addEventListener('focus', function() {
    if (window.typedInstance && typeof window.typedInstance.start === 'function') {
        window.typedInstance.start();
    }
});

window.addEventListener('blur', function() {
    if (window.typedInstance && typeof window.typedInstance.stop === 'function') {
        window.typedInstance.stop();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    stopTypingAnimation();
});

// Export functions for external use
window.TypingAnimation = {
    restart: restartTypingAnimation,
    stop: stopTypingAnimation,
    initialize: initializeTypedAnimation
};

// Custom typing effect class (alternative implementation)
class CustomTypingEffect {
    constructor(element, options = {}) {
        this.element = element;
        this.texts = options.texts || ['Desarrollador', 'Programador', 'Ingeniero'];
        this.typeSpeed = options.typeSpeed || 100;
        this.backSpeed = options.backSpeed || 50;
        this.backDelay = options.backDelay || 2000;
        this.startDelay = options.startDelay || 1000;
        this.loop = options.loop !== false;
        this.showCursor = options.showCursor !== false;
        this.cursorChar = options.cursorChar || '|';
        
        this.currentIndex = 0;
        this.currentText = '';
        this.isDeleting = false;
        this.charIndex = 0;
        this.isRunning = false;
        this.timeoutId = null;
        
        this.init();
    }
    
    init() {
        if (this.showCursor) {
            this.addCursorStyles();
        }
        
        setTimeout(() => {
            this.start();
        }, this.startDelay);
    }
    
    addCursorStyles() {
        if (!document.querySelector('#custom-cursor-style')) {
            const style = document.createElement('style');
            style.id = 'custom-cursor-style';
            style.textContent = `
                .custom-cursor {
                    animation: customBlink 1s infinite;
                }
                @keyframes customBlink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    start() {
        this.isRunning = true;
        this.type();
    }
    
    stop() {
        this.isRunning = false;
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }
    
    type() {
        if (!this.isRunning) return;
        
        const fullText = this.texts[this.currentIndex];
        
        if (this.isDeleting) {
            this.currentText = fullText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.currentText = fullText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }
        
        this.updateElement();
        
        let speed = this.isDeleting ? this.backSpeed : this.typeSpeed;
        
        if (!this.isDeleting && this.charIndex === fullText.length) {
            speed = this.backDelay;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.currentIndex = (this.currentIndex + 1) % this.texts.length;
            speed = 500;
            
            if (!this.loop && this.currentIndex === 0) {
                return; // Stop if not looping and back to start
            }
        }
        
        this.timeoutId = setTimeout(() => this.type(), speed);
    }
    
    updateElement() {
        if (this.showCursor) {
            this.element.innerHTML = this.currentText + `<span class="custom-cursor">${this.cursorChar}</span>`;
        } else {
            this.element.textContent = this.currentText;
        }
    }
    
    destroy() {
        this.stop();
        this.element.textContent = '';
    }
}

// Make CustomTypingEffect available globally
window.CustomTypingEffect = CustomTypingEffect;