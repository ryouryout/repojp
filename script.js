// Love Match - Main JavaScript

// ダークモード初期化
function initDarkMode() {
    // HTMLおよびlocal storageの設定を確認
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled' || 
                       (localStorage.getItem('darkMode') === null && 
                        window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    // ダークモードトグルボタンの選択
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const mobileDarkModeToggle = document.getElementById('mobile-dark-mode-toggle');
    
    // ダークモード適用関数
    function enableDarkMode() {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.add('dark-optimized');
        localStorage.setItem('darkMode', 'enabled');
        
        // トグルボタンの状態を同期
        if (darkModeToggle) darkModeToggle.checked = true;
        if (mobileDarkModeToggle) mobileDarkModeToggle.checked = true;
        
        // ダークモード時のUIを最適化
        optimizeDarkModeUI();
    }
    
    // ダークモード解除関数
    function disableDarkMode() {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.remove('dark-optimized');
        localStorage.setItem('darkMode', 'disabled');
        
        // トグルボタンの状態を同期
        if (darkModeToggle) darkModeToggle.checked = false;
        if (mobileDarkModeToggle) mobileDarkModeToggle.checked = false;
    }
    
    // ダークモードUI最適化
    function optimizeDarkModeUI() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            if (!card.classList.contains('bg-white') && !card.classList.contains('dark:bg-gray-800')) {
                card.classList.add('bg-white', 'dark:bg-gray-800');
            }
        });
    }
    
    // 初期状態の設定
    if (isDarkMode) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
    
    // イベントリスナーの設定
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                enableDarkMode();
            } else {
                disableDarkMode();
            }
        });
    }
    
    if (mobileDarkModeToggle) {
        mobileDarkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                enableDarkMode();
            } else {
                disableDarkMode();
            }
        });
    }
    
    // システムのカラースキーム変更を検知
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (e.matches && localStorage.getItem('darkMode') === null) {
            enableDarkMode();
        } else if (!e.matches && localStorage.getItem('darkMode') === null) {
            disableDarkMode();
        }
    });
}

// モバイル環境での視認性向上のための関数
function enhanceMobileVisibility() {
    if (window.innerWidth <= 768) {
        document.body.classList.add('mobile-enhanced');
        
        // テキストの色を強調してコントラストを高める
        const textElements = document.querySelectorAll('.text-gray-600, .text-gray-700, .text-gray-800');
        textElements.forEach(el => {
            if (window.getComputedStyle(el).color === 'rgb(75, 85, 99)' || 
                window.getComputedStyle(el).color === 'rgb(55, 65, 81)' || 
                window.getComputedStyle(el).color === 'rgb(31, 41, 55)') {
                el.style.color = '#f3f4f6';
            }
        });
        
        // モバイルナビゲーションのコントラスト向上
        const mobileNavLinks = document.querySelectorAll('.mobile-menu a');
        mobileNavLinks.forEach(link => {
            link.style.color = '#f3f4f6';
        });
    }
}

// モバイルメニュー初期化
function initMobileMenu() {
    const menuButton = document.getElementById('menu-button');
    const closeMenuButton = document.getElementById('close-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function(e) {
            e.preventDefault();
            mobileMenu.classList.add('active');
            mobileMenu.style.transform = 'translateX(0)';
            document.body.style.overflow = 'hidden'; // スクロール防止
            
            // アクセシビリティ対応
            menuButton.setAttribute('aria-expanded', 'true');
            mobileMenu.setAttribute('aria-hidden', 'false');
            
            // 最初のメニュー項目にフォーカスする
            const firstMenuItem = mobileMenu.querySelector('a');
            if (firstMenuItem) {
                setTimeout(() => {
                    firstMenuItem.focus();
                }, 100);
            }
        });
    }
    
    if (closeMenuButton && mobileMenu) {
        closeMenuButton.addEventListener('click', function() {
            closeMenu();
        });
    }
    
    // メニュー外をクリックした場合や ESC キーでメニューを閉じる
    document.addEventListener('click', function(e) {
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            if (!mobileMenu.contains(e.target) && e.target !== menuButton) {
                closeMenu();
            }
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    function closeMenu() {
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            mobileMenu.style.transform = 'translateX(100%)';
            document.body.style.overflow = ''; // スクロール許可
            
            // アクセシビリティ対応
            if (menuButton) {
                menuButton.setAttribute('aria-expanded', 'false');
                menuButton.focus(); // メニューボタンにフォーカスを戻す
            }
            mobileMenu.setAttribute('aria-hidden', 'true');
        }
    }
}

// ページ遷移の初期化
function initPageTransitions() {
    const navLinks = document.querySelectorAll('a[href]:not([target="_blank"]):not([href^="#"]):not([href^="javascript"])');
    
    // ページロード時のアニメーション
    const main = document.querySelector('main');
    if (main) {
        main.classList.add('fade-in');
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // ダークモード設定を保持してページ遷移
            const isDarkMode = document.documentElement.classList.contains('dark');
            
            if (link.hostname === window.location.hostname) {
                e.preventDefault();
                const href = link.getAttribute('href');
                
                // ページ遷移アニメーション
                if (main) {
                    main.style.opacity = '0';
                    main.style.transform = 'translateY(10px)';
                }
                
                // 現在のダークモード設定を一時保存
                sessionStorage.setItem('preserveDarkMode', isDarkMode ? 'enabled' : 'disabled');
                
                // アニメーション完了後に遷移
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            }
        });
    });
    
    // 前のページからダークモード設定を取得して適用
    window.addEventListener('DOMContentLoaded', function() {
        const preserveDarkMode = sessionStorage.getItem('preserveDarkMode');
        if (preserveDarkMode === 'enabled') {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.add('dark-optimized');
            
            // トグルボタンの状態を同期
            const darkModeToggle = document.getElementById('dark-mode-toggle');
            const mobileDarkModeToggle = document.getElementById('mobile-dark-mode-toggle');
            if (darkModeToggle) darkModeToggle.checked = true;
            if (mobileDarkModeToggle) mobileDarkModeToggle.checked = true;
        }
    });
}

// 画像の遅延読み込み
function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        // ブラウザがネイティブの遅延読み込みをサポートしている場合
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    } else {
        // フォールバック
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }
}

// マッチングカードのスワイプ機能
function initMatchingCards() {
    const matchingCards = document.querySelectorAll('.matching-card');
    const likeButtons = document.querySelectorAll('.btn-like');
    const passButtons = document.querySelectorAll('.btn-pass');
    const messageButtons = document.querySelectorAll('.btn-message');
    
    let currentCardIndex = 0;
    
    function showNextCard() {
        currentCardIndex++;
        if (currentCardIndex < matchingCards.length) {
            matchingCards[currentCardIndex].style.display = 'block';
            matchingCards[currentCardIndex].classList.add('slide-up');
        } else {
            // すべてのカードがスワイプされた場合
            document.querySelector('.no-more-matches')?.classList.remove('hidden');
        }
    }
    
    if (likeButtons.length > 0 && matchingCards.length > 0) {
        likeButtons.forEach((button, index) => {
            button.addEventListener('click', function() {
                const card = matchingCards[index];
                card.classList.add('swiped-right');
                
                // いいね！のアニメーション
                const heart = document.createElement('div');
                heart.classList.add('heart-animation');
                card.appendChild(heart);
                
                setTimeout(() => {
                    card.style.display = 'none';
                    card.classList.remove('swiped-right');
                    heart.remove();
                    showNextCard();
                }, 500);
            });
        });
    }
    
    if (passButtons.length > 0 && matchingCards.length > 0) {
        passButtons.forEach((button, index) => {
            button.addEventListener('click', function() {
                const card = matchingCards[index];
                card.classList.add('swiped-left');
                
                setTimeout(() => {
                    card.style.display = 'none';
                    card.classList.remove('swiped-left');
                    showNextCard();
                }, 500);
            });
        });
    }
    
    if (messageButtons.length > 0) {
        messageButtons.forEach(button => {
            button.addEventListener('click', function() {
                // メッセージモーダルを表示するロジック
                const messageModal = document.getElementById('message-modal');
                if (messageModal) {
                    messageModal.classList.remove('hidden');
                    document.querySelector('body').style.overflow = 'hidden';
                    
                    // フォーカスをモーダル内の最初のフォーカス可能な要素に移動
                    const firstFocusable = messageModal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                    if (firstFocusable) {
                        firstFocusable.focus();
                    }
                }
            });
        });
    }
    
    // モーダル閉じるボタン
    const closeModalButtons = document.querySelectorAll('.close-modal');
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.add('hidden');
                document.querySelector('body').style.overflow = '';
            }
        });
    });
}

// プロフィールの詳細表示
function initProfileDetails() {
    const showDetailButtons = document.querySelectorAll('.show-profile-details');
    const profileModal = document.getElementById('profile-detail-modal');
    
    if (showDetailButtons.length > 0 && profileModal) {
        showDetailButtons.forEach(button => {
            button.addEventListener('click', function() {
                // プロフィール情報を取得してモーダルに表示
                const cardElement = this.closest('.matching-card');
                if (cardElement) {
                    const name = cardElement.querySelector('.card-name')?.textContent;
                    const age = cardElement.querySelector('.card-age')?.textContent;
                    const location = cardElement.querySelector('.card-location')?.textContent;
                    const image = cardElement.querySelector('.card-image')?.src;
                    const bio = cardElement.querySelector('.card-bio')?.textContent;
                    
                    // モーダルに情報を設定
                    profileModal.querySelector('.profile-name').textContent = name || '';
                    profileModal.querySelector('.profile-age').textContent = age || '';
                    profileModal.querySelector('.profile-location').textContent = location || '';
                    profileModal.querySelector('.profile-image').src = image || '';
                    profileModal.querySelector('.profile-bio').textContent = bio || '';
                    
                    // モーダルを表示
                    profileModal.classList.remove('hidden');
                    document.querySelector('body').style.overflow = 'hidden';
                }
            });
        });
    }
}

// フォーム入力の検証
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            // 必須フィールドのチェック
            const requiredInputs = form.querySelectorAll('[required]');
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('border-red-500');
                    
                    // エラーメッセージの表示
                    let errorMessage = input.nextElementSibling;
                    if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                        errorMessage = document.createElement('p');
                        errorMessage.classList.add('error-message', 'text-red-500', 'text-sm', 'mt-1');
                        errorMessage.textContent = '入力してください';
                        input.insertAdjacentElement('afterend', errorMessage);
                    }
                } else {
                    input.classList.remove('border-red-500');
                    
                    // エラーメッセージの削除
                    const errorMessage = input.nextElementSibling;
                    if (errorMessage && errorMessage.classList.contains('error-message')) {
                        errorMessage.remove();
                    }
                }
            });
            
            // メールアドレスの検証
            const emailInputs = form.querySelectorAll('input[type="email"]');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            emailInputs.forEach(input => {
                if (input.value.trim() && !emailRegex.test(input.value.trim())) {
                    isValid = false;
                    input.classList.add('border-red-500');
                    
                    // エラーメッセージの表示
                    let errorMessage = input.nextElementSibling;
                    if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                        errorMessage = document.createElement('p');
                        errorMessage.classList.add('error-message', 'text-red-500', 'text-sm', 'mt-1');
                        errorMessage.textContent = '有効なメールアドレスを入力してください';
                        input.insertAdjacentElement('afterend', errorMessage);
                    } else {
                        errorMessage.textContent = '有効なメールアドレスを入力してください';
                    }
                }
            });
            
            // パスワードの検証
            const passwordInputs = form.querySelectorAll('input[type="password"]');
            passwordInputs.forEach(input => {
                if (input.dataset.minLength && input.value.length < parseInt(input.dataset.minLength)) {
                    isValid = false;
                    input.classList.add('border-red-500');
                    
                    // エラーメッセージの表示
                    let errorMessage = input.nextElementSibling;
                    if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                        errorMessage = document.createElement('p');
                        errorMessage.classList.add('error-message', 'text-red-500', 'text-sm', 'mt-1');
                        errorMessage.textContent = `パスワードは${input.dataset.minLength}文字以上で入力してください`;
                        input.insertAdjacentElement('afterend', errorMessage);
                    } else {
                        errorMessage.textContent = `パスワードは${input.dataset.minLength}文字以上で入力してください`;
                    }
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
}

// サービスワーカーの登録
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

// アプリケーションの初期化
function initApp() {
    // ダークモードの初期化
    initDarkMode();
    
    // モバイルメニューの初期化
    initMobileMenu();
    
    // ページ遷移の初期化
    initPageTransitions();
    
    // 遅延読み込みの初期化
    initLazyLoading();
    
    // マッチングカードの初期化
    initMatchingCards();
    
    // プロフィール詳細機能の初期化
    initProfileDetails();
    
    // フォーム検証の初期化
    initFormValidation();
    
    // サービスワーカーの登録
    registerServiceWorker();
    
    // CSSアニメーション用クラスの追加
    document.querySelectorAll('.card').forEach(card => {
        if (!card.classList.contains('transition-all')) {
            card.classList.add('transition-all');
        }
    });
    
    // モバイルナビゲーションリンクのスタイル修正
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        if (!link.classList.contains('flex')) {
            link.classList.add('flex', 'items-center', 'text-gray-700', 'dark:text-gray-300');
        }
    });
}

// DOM読み込み完了時にアプリケーションを初期化
document.addEventListener('DOMContentLoaded', initApp);

// ページの読み込み完了時に実行
window.addEventListener('load', function() {
    // ローディングスピナーがあれば非表示にする
    const loadingSpinner = document.querySelector('.loading-spinner-container');
    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
    }
    
    // モバイル環境でダークモードなら視認性を向上
    if (document.documentElement.classList.contains('dark') && window.innerWidth <= 768) {
        enhanceMobileVisibility();
    }
});

// リサイズ時の処理
window.addEventListener('resize', function() {
    // モバイル環境でダークモードなら視認性を向上
    if (document.documentElement.classList.contains('dark') && window.innerWidth <= 768) {
        enhanceMobileVisibility();
    } else if (window.innerWidth > 768) {
        document.body.classList.remove('mobile-enhanced');
    }
});

// DOM要素が読み込まれた後に実行
document.addEventListener('DOMContentLoaded', function() {
    setupDarkMode();
    setupMobileMenu();
    setupAnimations();
});

/**
 * ダークモードの設定と切り替え機能
 */
function setupDarkMode() {
    // すべてのダークモードトグルを取得
    const darkModeToggles = document.querySelectorAll('.dark-mode-toggle');
    
    // 現在のダークモード状態を確認
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    // トグル状態を設定
    darkModeToggles.forEach(toggle => {
        toggle.checked = isDarkMode;
    });
    
    // クリックイベントリスナーを追加
    darkModeToggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            toggleDarkMode(this.checked);
        });
    });
}

/**
 * ダークモードの切り替え
 * @param {boolean} enable - trueならダークモードを有効にする
 */
function toggleDarkMode(enable) {
    if (enable) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.add('dark-optimized');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.remove('dark-optimized');
        localStorage.setItem('darkMode', 'disabled');
    }
    
    // すべてのトグルを同期
    const darkModeToggles = document.querySelectorAll('.dark-mode-toggle');
    darkModeToggles.forEach(toggle => {
        toggle.checked = enable;
    });
}

/**
 * モバイルメニューの設定
 */
function setupMobileMenu() {
    const menuButton = document.getElementById('menu-button');
    const closeMenuButton = document.getElementById('close-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (!menuButton || !closeMenuButton || !mobileMenu) return;
    
    // メニューを開く
    menuButton.addEventListener('click', function() {
        mobileMenu.classList.remove('translate-x-full');
        document.body.classList.add('overflow-hidden');
        menuButton.setAttribute('aria-expanded', 'true');
        mobileMenu.setAttribute('aria-hidden', 'false');
    });
    
    // メニューを閉じる
    closeMenuButton.addEventListener('click', function() {
        mobileMenu.classList.add('translate-x-full');
        document.body.classList.remove('overflow-hidden');
        menuButton.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
    });
    
    // モバイルメニュー内のリンクをクリックした時にメニューを閉じる
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('translate-x-full');
            document.body.classList.remove('overflow-hidden');
            menuButton.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
        });
    });
}

/**
 * ページアニメーションの設定
 */
function setupAnimations() {
    // ページ遷移のアニメーション
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            document.body.classList.add('page-visible');
        }
    });
    
    // ナビゲーションリンクのアクティブ状態を管理
    highlightCurrentPage();
    
    // カードホバーのアニメーション強化
    setupCardHoverEffects();
}

/**
 * 現在のページに対応するナビゲーションリンクをハイライト
 */
function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const filename = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    
    // デスクトップとモバイルの両方のナビゲーションリンクを取得
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    // デスクトップナビゲーションリンクの更新
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === filename || (filename === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // モバイルナビゲーションリンクの更新
    mobileNavLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === filename || (filename === '' && href === 'index.html')) {
            link.classList.add('text-indigo-600', 'dark:text-indigo-400');
            link.classList.remove('text-gray-700', 'dark:text-gray-300', 'hover:text-indigo-600', 'dark:hover:text-indigo-400');
        }
    });
}

/**
 * カードホバー効果の設定
 */
function setupCardHoverEffects() {
    // カードの要素を選択
    const cards = document.querySelectorAll('.card, .user-card, .profile-card, .message-preview');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('card-hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('card-hover');
        });
    });
}

/**
 * メッセージを送信する（メッセージページ用）
 */
function sendMessage() {
    const messageInput = document.querySelector('.message-input');
    
    if (!messageInput) return;
    
    // メッセージ送信ボタンを取得
    const sendButton = document.querySelector('.send-button');
    
    if (sendButton) {
        sendButton.addEventListener('click', function() {
            const message = messageInput.value.trim();
            if (message !== '') {
                // 実際のアプリではここでAPIを呼び出してメッセージを送信
                console.log('Sending message:', message);
                
                // メッセージ入力をクリア
                messageInput.value = '';
                
                // メッセージを表示（簡易的な例）
                const chatContent = document.querySelector('.flex-1.p-4.overflow-y-auto');
                if (chatContent) {
                    const newMessage = document.createElement('div');
                    newMessage.className = 'flex items-end justify-end';
                    newMessage.innerHTML = `
                        <div class="message-bubble sent max-w-[75%]">
                            <p>${message}</p>
                            <span class="message-time">${getCurrentTime()}</span>
                        </div>
                    `;
                    chatContent.appendChild(newMessage);
                    chatContent.scrollTop = chatContent.scrollHeight;
                }
            }
        });
        
        // Enter キーでも送信可能に
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendButton.click();
            }
        });
    }
}

/**
 * 現在の時刻を取得する（メッセージのタイムスタンプ用）
 * @returns {string} 時:分 形式の時刻文字列
 */
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// モバイルメニューの位置を調整する（スクロール時）
window.addEventListener('scroll', function() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu && window.innerWidth < 768) {
        mobileMenu.style.top = '0px';
    }
});

// ページが完全にロードされたときに実行する追加の機能
window.addEventListener('load', function() {
    // メッセージ機能の初期化（messages.htmlページの場合）
    if (window.location.pathname.includes('messages.html')) {
        sendMessage();
    }
    
    // ページトランジションを終了
    document.body.classList.add('loaded');
}); 