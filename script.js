// Dark mode functionality
function initDarkMode() {
    const darkModeToggles = document.querySelectorAll('.dark-mode-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // モバイルとデスクトップの画面サイズを検出
    const isMobile = window.innerWidth < 768;
    
    // モバイル用のデフォルト設定 - デフォルトでライトモード推奨（視認性のため）
    if (isMobile && localStorage.getItem('darkMode') === null) {
        localStorage.setItem('darkMode', 'false');
    }
    
    // Check for saved theme preference or use the system preference
    if (localStorage.getItem('darkMode') === 'true' || 
        (localStorage.getItem('darkMode') === null && prefersDarkScheme.matches)) {
        document.documentElement.classList.add('dark');
        darkModeToggles.forEach(toggle => toggle.checked = true);
    } else {
        document.documentElement.classList.remove('dark');
        darkModeToggles.forEach(toggle => toggle.checked = false);
    }
    
    // Toggle dark mode with improved transition
    darkModeToggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            // トグル状態に基づいてアニメーションを適用
            document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
            
            if (this.checked) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('darkMode', 'true');
                
                // モバイルでは自動スクロール位置を保持（視覚効果）
                if (isMobile) {
                    const scrollPosition = window.pageYOffset;
                    setTimeout(() => window.scrollTo(0, scrollPosition), 100);
                }
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('darkMode', 'false');
            }
            
            // アニメーションをリセット
            setTimeout(() => {
                document.body.style.transition = '';
            }, 500);
        });
    });
    
    // System color scheme change detection with improved handling
    prefersDarkScheme.addEventListener('change', (e) => {
        // システム設定の変更はモバイルでは無視（ユーザー優先）
        if (isMobile) return;
        
        if (localStorage.getItem('darkMode') === null) {
            if (e.matches) {
                document.documentElement.classList.add('dark');
                darkModeToggles.forEach(toggle => toggle.checked = true);
            } else {
                document.documentElement.classList.remove('dark');
                darkModeToggles.forEach(toggle => toggle.checked = false);
            }
        }
    });
    
    // ウィンドウリサイズ時にモバイル/デスクトップ検出を更新
    window.addEventListener('resize', () => {
        const newIsMobile = window.innerWidth < 768;
        if (newIsMobile !== isMobile && localStorage.getItem('darkMode') === null) {
            // モバイルに切り替わった場合、デフォルトでライトモードに
            if (newIsMobile) {
                document.documentElement.classList.remove('dark');
                darkModeToggles.forEach(toggle => toggle.checked = false);
            }
        }
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const menuToggleButtons = document.querySelectorAll('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (!mobileMenu || menuToggleButtons.length === 0) return;
    
    // Menu button click event
    menuToggleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            mobileMenu.classList.toggle('active');
            
            // Menu is open, disable scrolling
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
            
            // Accessibility attribute toggle
            const isExpanded = mobileMenu.classList.contains('active');
            menuToggleButtons.forEach(btn => btn.setAttribute('aria-expanded', isExpanded));
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            ![...menuToggleButtons].some(btn => btn.contains(e.target))) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
            menuToggleButtons.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
        }
    });
    
    // Close menu with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
            menuToggleButtons.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
        }
    });
}

// Page transitions
function initPageTransitions() {
    document.addEventListener('DOMContentLoaded', function() {
        document.body.classList.add('loaded');
    });
    
    // Add transition effect when navigating to a new page
    document.querySelectorAll('a').forEach(link => {
        // Only apply to links within the same origin
        if (link.href && (link.hostname === window.location.hostname)) {
            link.addEventListener('click', function(e) {
                // Skip anchor links and JavaScript processing
                if (
                    link.href.startsWith('#') || 
                    link.href.startsWith('javascript:') || 
                    link.target === '_blank'
                ) {
                    return;
                }
                
                e.preventDefault();
                
                // Fade out animation
                document.body.classList.add('page-leaving');
                
                // Move to new page after animation completes
                setTimeout(() => {
                    window.location.href = link.href;
                }, 300); // Adjust animation time to match fade out
            });
        }
    });
}

// Lazy loading images
function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Intersection Observer fallback for browsers that don't support lazy loading
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if (lazyImages.length === 0) return;
        
        const lazyImageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove('lazy');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });
        
        lazyImages.forEach(image => {
            lazyImageObserver.observe(image);
        });
    }
}

// Register service worker for offline functionality
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/service-worker.js')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(function(error) {
                    console.log('ServiceWorker registration failed: ', error);
                });
        });
    }
}

// Initialize all functionality
function initApp() {
    initDarkMode();
    initMobileMenu();
    initPageTransitions();
    initLazyLoading();
    registerServiceWorker();
    
    // Animation initialization
    document.querySelectorAll('.slide-up').forEach((element, index) => {
        element.style.animationDelay = (index * 0.1) + 's';
    });
}

// Run initialization
document.addEventListener('DOMContentLoaded', initApp); 