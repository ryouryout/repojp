/**
 * Love Match - Main JavaScript
 * Handles common functionality across the application
 */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    // Initialize components
    initNavigation();
    initDarkMode();
    initLazyLoading();
    initPageTransitions();
    initFormValidation();
    
    // Page specific initializations
    if (document.querySelector('.matching-card')) {
        initMatchingCards();
    }
    
    if (document.querySelector('.message-list')) {
        initMessaging();
    }
}

/**
 * Initialize navigation functionality
 */
function initNavigation() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Add active class to current page link
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize dark mode functionality - disabled as per client request
 */
function initDarkMode() {
    // Dark mode has been disabled as per client request
    // Ensure all dark mode classes are removed
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark-mode');
    document.documentElement.classList.remove('dark-optimized');
    
    // Clear any stored dark mode preferences
    localStorage.removeItem('darkMode');
    
    // Hide dark mode toggles
    const darkModeToggles = document.querySelectorAll('.dark-mode-toggle');
    darkModeToggles.forEach(toggle => {
        if (toggle.parentElement) {
            toggle.parentElement.style.display = 'none';
        }
    });
}

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img.lazy-load');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }
}

/**
 * Initialize page transitions
 */
function initPageTransitions() {
    const pageContent = document.querySelector('.page-transition');
    
    if (pageContent) {
        // Add loaded class after a short delay
        setTimeout(() => {
            pageContent.classList.add('loaded');
        }, 100);
    }
    
    // Handle link clicks for smooth page transitions
    document.querySelectorAll('a').forEach(link => {
        // Skip external links and anchors
        if (link.hostname !== window.location.hostname || link.getAttribute('href').startsWith('#')) {
            return;
        }
        
        link.addEventListener('click', (e) => {
            const pageContent = document.querySelector('.page-transition');
            
            if (pageContent) {
                e.preventDefault();
                const href = link.getAttribute('href');
                
                // Animate out
                pageContent.classList.remove('loaded');
                
                // Navigate after animation completes
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            }
        });
    });
}

/**
 * Initialize form validation
 */
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Skip submit buttons
            if (input.type === 'submit') return;
            
            // Add blur event for validation
            input.addEventListener('blur', () => {
                validateInput(input);
            });
            
            // Add input event for real-time validation
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateInput(input);
                }
            });
        });
        
        // Form submit validation
        form.addEventListener('submit', (e) => {
            let isValid = true;
            
            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
}

/**
 * Validate a form input
 * @param {HTMLElement} input - The input element to validate
 * @returns {boolean} - Whether the input is valid
 */
function validateInput(input) {
    const errorElement = input.nextElementSibling;
    let isValid = true;
    let errorMessage = '';
    
    // Required validation
    if (input.required && !input.value.trim()) {
        isValid = false;
        errorMessage = '入力必須項目です';
    }
    
    // Email validation
    if (input.type === 'email' && input.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value.trim())) {
            isValid = false;
            errorMessage = '有効なメールアドレスを入力してください';
        }
    }
    
    // Password validation
    if (input.type === 'password' && input.value.trim()) {
        if (input.value.length < 8) {
            isValid = false;
            errorMessage = 'パスワードは8文字以上必要です';
        }
    }
    
    // Password confirmation validation
    if (input.id === 'password-confirm' && input.value.trim()) {
        const passwordInput = document.getElementById('password');
        if (passwordInput && input.value !== passwordInput.value) {
            isValid = false;
            errorMessage = 'パスワードが一致しません';
        }
    }
    
    // Update UI based on validation
    if (!isValid) {
        input.classList.add('error');
        
        // Create error message element if it doesn't exist
        if (!errorElement || !errorElement.classList.contains('form-error')) {
            const newErrorElement = document.createElement('div');
            newErrorElement.className = 'form-error';
            newErrorElement.textContent = errorMessage;
            input.parentNode.insertBefore(newErrorElement, input.nextSibling);
        } else {
            errorElement.textContent = errorMessage;
        }
    } else {
        input.classList.remove('error');
        
        // Remove error message if it exists
        if (errorElement && errorElement.classList.contains('form-error')) {
            errorElement.remove();
        }
    }
    
    return isValid;
}

/**
 * Initialize matching card functionality
 */
function initMatchingCards() {
    const card = document.querySelector('.matching-card');
    const likeButton = document.querySelector('.like-button');
    const dislikeButton = document.querySelector('.dislike-button');
    
    if (card && likeButton && dislikeButton) {
        // Touch handling for swiping
        let startX = 0;
        let currentX = 0;
        
        card.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        card.addEventListener('touchmove', (e) => {
            currentX = e.touches[0].clientX;
            const diffX = currentX - startX;
            
            // Limit the drag
            if (Math.abs(diffX) < 150) {
                card.style.transform = `translateX(${diffX}px) rotate(${diffX * 0.1}deg)`;
                
                // Change opacity based on swipe direction
                if (diffX > 0) {
                    card.style.boxShadow = '0 10px 25px rgba(52, 211, 153, 0.3)';
                } else if (diffX < 0) {
                    card.style.boxShadow = '0 10px 25px rgba(239, 68, 68, 0.3)';
                }
            }
        });
        
        card.addEventListener('touchend', () => {
            const diffX = currentX - startX;
            
            if (diffX > 100) {
                // Swipe right (like)
                card.classList.add('swiped-right');
                setTimeout(getNextProfile, 300);
            } else if (diffX < -100) {
                // Swipe left (dislike)
                card.classList.add('swiped-left');
                setTimeout(getNextProfile, 300);
            } else {
                // Reset position
                card.style.transform = '';
                card.style.boxShadow = '';
            }
        });
        
        // Button click handlers
        likeButton.addEventListener('click', () => {
            card.classList.add('swiped-right');
            setTimeout(getNextProfile, 300);
        });
        
        dislikeButton.addEventListener('click', () => {
            card.classList.add('swiped-left');
            setTimeout(getNextProfile, 300);
        });
    }
}

/**
 * Get the next profile for matching
 * This would typically fetch from an API
 */
function getNextProfile() {
    const card = document.querySelector('.matching-card');
    const nameElement = card.querySelector('.profile-name');
    const ageElement = card.querySelector('.profile-age');
    const imageElement = card.querySelector('.card-image');
    
    // Show loading state
    card.classList.add('loading');
    
    // Simulate API call with timeout
    setTimeout(() => {
        // Reset card position and classes
        card.style.transform = '';
        card.style.boxShadow = '';
        card.classList.remove('swiped-left', 'swiped-right', 'loading');
        
        // Update with new profile data (this would come from API)
        const profiles = [
            { name: '田中 美咲', age: 28, image: 'https://source.unsplash.com/400x600/?woman,portrait/1' },
            { name: '佐藤 健太', age: 32, image: 'https://source.unsplash.com/400x600/?man,portrait/2' },
            { name: '鈴木 あおい', age: 26, image: 'https://source.unsplash.com/400x600/?woman,portrait/3' },
            { name: '高橋 大輔', age: 30, image: 'https://source.unsplash.com/400x600/?man,portrait/4' },
            { name: '渡辺 さくら', age: 25, image: 'https://source.unsplash.com/400x600/?woman,portrait/5' }
        ];
        
        const randomProfile = profiles[Math.floor(Math.random() * profiles.length)];
        
        nameElement.textContent = randomProfile.name;
        ageElement.textContent = randomProfile.age;
        imageElement.src = randomProfile.image;
        
        // Animate in the new card
        card.classList.add('fade-in');
        setTimeout(() => {
            card.classList.remove('fade-in');
        }, 500);
    }, 500);
}

/**
 * Initialize messaging functionality
 */
function initMessaging() {
    const messageList = document.querySelector('.message-list');
    const messageForm = document.querySelector('.message-form');
    const messageInput = document.querySelector('.message-input');
    const messagePreviews = document.querySelectorAll('.message-preview');
    
    if (messageList && messageForm && messageInput) {
        // Scroll to bottom of message list
        messageList.scrollTop = messageList.scrollHeight;
        
        // Handle message form submission
        messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const message = messageInput.value.trim();
            if (!message) return;
            
            // Add message to UI
            addMessage(message, 'sent');
            
            // Clear input
            messageInput.value = '';
            
            // Show typing indicator
            showTypingIndicator();
            
            // Simulate response after delay
            setTimeout(() => {
                // Hide typing indicator
                hideTypingIndicator();
                
                // Add response message
                const responses = [
                    'はい、いいですね！',
                    'ありがとうございます！',
                    'それは素敵ですね。',
                    'もう少し詳しく教えてください。',
                    '了解しました！',
                    'それについてどう思いますか？'
                ];
                
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addMessage(randomResponse, 'received');
            }, 1500);
        });
        
        // Handle message preview clicks
        messagePreviews.forEach(preview => {
            preview.addEventListener('click', () => {
                // Remove active class from all previews
                messagePreviews.forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked preview
                preview.classList.add('active');
                
                // On mobile, show the conversation view
                const mobileView = document.querySelector('.mobile-view');
                if (mobileView) {
                    mobileView.classList.add('active');
                }
                
                // Update conversation (this would fetch from API)
                const contactName = preview.querySelector('.contact-name').textContent;
                document.querySelector('.conversation-header .contact-name').textContent = contactName;
                
                // Clear existing messages
                const messagesContainer = document.querySelector('.messages-container');
                messagesContainer.innerHTML = '';
                
                // Add sample messages
                addMessage('こんにちは！', 'received');
                addMessage('お元気ですか？', 'received');
                addMessage('元気です！あなたは？', 'sent');
                addMessage('私も元気です。今週末、時間ありますか？', 'received');
                
                // Scroll to bottom
                messageList.scrollTop = messageList.scrollHeight;
            });
        });
        
        // Handle back button on mobile
        const backButton = document.querySelector('.back-button');
        if (backButton) {
            backButton.addEventListener('click', () => {
                const mobileView = document.querySelector('.mobile-view');
                if (mobileView) {
                    mobileView.classList.remove('active');
                }
            });
        }
    }
}

/**
 * Add a message to the conversation
 * @param {string} text - The message text
 * @param {string} type - The message type ('sent' or 'received')
 */
function addMessage(text, type) {
    const messagesContainer = document.querySelector('.messages-container');
    const messageList = document.querySelector('.message-list');
    
    if (messagesContainer && messageList) {
        const messageElement = document.createElement('div');
        messageElement.className = `flex ${type === 'sent' ? 'justify-end' : 'justify-start'} mb-4`;
        
        messageElement.innerHTML = `
            <div class="message-bubble ${type} slide-up">
                ${text}
            </div>
        `;
        
        messagesContainer.appendChild(messageElement);
        
        // Scroll to bottom
        messageList.scrollTop = messageList.scrollHeight;
    }
}

/**
 * Show typing indicator
 */
function showTypingIndicator() {
    const messagesContainer = document.querySelector('.messages-container');
    const messageList = document.querySelector('.message-list');
    
    if (messagesContainer && messageList) {
        // Create typing indicator if it doesn't exist
        if (!document.querySelector('.typing-indicator-container')) {
            const typingElement = document.createElement('div');
            typingElement.className = 'typing-indicator-container flex justify-start mb-4';
            
            typingElement.innerHTML = `
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `;
            
            messagesContainer.appendChild(typingElement);
            
            // Scroll to bottom
            messageList.scrollTop = messageList.scrollHeight;
        }
    }
}

/**
 * Hide typing indicator
 */
function hideTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator-container');
    
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

/**
 * Service Worker Registration for offline functionality
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
} 