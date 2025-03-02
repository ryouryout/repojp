/* Love Match - マッチングアプリJavaScript */

document.addEventListener('DOMContentLoaded', function() {
  // モバイルメニュートグル
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const menuNav = document.querySelector('.menu');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
      menuNav.classList.toggle('show');
    });

    // メニュー外クリックで閉じる
    document.addEventListener('click', function(event) {
      if (!event.target.closest('.mobile-menu-btn') && !event.target.closest('.menu')) {
        if (menuNav.classList.contains('show')) {
          menuNav.classList.remove('show');
        }
      }
    });
  }

  // アクティブなナビゲーションリンク
  const currentLocation = location.href;
  const menuLinks = document.querySelectorAll('.menu a');
  menuLinks.forEach(link => {
    if (link.href === currentLocation) {
      link.classList.add('active');
    }
  });

  // スムーススクロール
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // スクロールアニメーション
  const animateOnScroll = function() {
    const elements = document.querySelectorAll('.fade-in, .fade-up, .fade-right');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight * 0.8;
      
      if (elementPosition < screenPosition) {
        element.classList.add('visible');
      }
    });
  };

  // 初期チェック
  animateOnScroll();
  
  // スクロールイベント
  window.addEventListener('scroll', animateOnScroll);

  // フォームバリデーション
  const forms = document.querySelectorAll('form.validate-form');
  
  forms.forEach(form => {
    const submitBtn = form.querySelector('[type="submit"]');
    
    if (submitBtn) {
      form.addEventListener('submit', function(e) {
        let isValid = true;
        
        // 必須フィールドのチェック
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
          if (!validateField(field)) {
            isValid = false;
          }
        });
        
        // 特定のフィールドタイプのバリデーション
        const emailFields = form.querySelectorAll('input[type="email"]');
        emailFields.forEach(field => {
          if (field.value.trim() && !isValidEmail(field.value)) {
            showError(field, '有効なメールアドレスを入力してください');
            isValid = false;
          }
        });
        
        const passwordField = form.querySelector('#password');
        const confirmPasswordField = form.querySelector('#confirm-password');
        
        if (passwordField && confirmPasswordField) {
          if (passwordField.value !== confirmPasswordField.value) {
            showError(confirmPasswordField, 'パスワードが一致しません');
            isValid = false;
          }
        }
        
        if (!isValid) {
          e.preventDefault();
        }
      });
      
      // フィールド入力時のエラー解除
      const inputFields = form.querySelectorAll('input, textarea, select');
      inputFields.forEach(field => {
        field.addEventListener('input', function() {
          validateField(this);
        });
        
        field.addEventListener('blur', function() {
          validateField(this);
        });
      });
    }
  });

  // フィールドバリデーション
  function validateField(field) {
    if (field.hasAttribute('required') && !field.value.trim()) {
      showError(field, '必須項目です');
      return false;
    }
    
    if (field.type === 'email' && field.value.trim() && !isValidEmail(field.value)) {
      showError(field, '有効なメールアドレスを入力してください');
      return false;
    }
    
    clearError(field);
    return true;
  }

  // エラー表示
  function showError(field, message) {
    const formGroup = field.closest('.form-group');
    if (formGroup) {
      formGroup.classList.add('error');
      
      let errorElement = formGroup.querySelector('.error-message');
      if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
      }
      
      errorElement.textContent = message;
    }
  }

  // エラークリア
  function clearError(field) {
    const formGroup = field.closest('.form-group');
    if (formGroup) {
      formGroup.classList.remove('error');
      
      const errorElement = formGroup.querySelector('.error-message');
      if (errorElement) {
        errorElement.textContent = '';
      }
    }
  }

  // メールバリデーション
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // パスワード強度チェック
  const passwordInputs = document.querySelectorAll('.password-with-strength');
  
  passwordInputs.forEach(input => {
    input.addEventListener('input', function() {
      const password = this.value;
      const formGroup = this.closest('.form-group');
      const strengthIndicator = formGroup.querySelector('.password-strength');
      
      if (strengthIndicator) {
        const strength = checkPasswordStrength(password);
        
        // 強度メーターを更新
        strengthIndicator.className = 'password-strength';
        strengthIndicator.classList.add(strength.className);
        
        const strengthText = strengthIndicator.querySelector('.strength-text');
        if (strengthText) {
          strengthText.textContent = strength.text;
        }
        
        const strengthBar = strengthIndicator.querySelector('.strength-bar span');
        if (strengthBar) {
          strengthBar.style.width = strength.percentage + '%';
        }
      }
    });
  });

  // パスワード強度を評価
  function checkPasswordStrength(password) {
    // 空のパスワード
    if (!password) {
      return {
        text: '',
        className: '',
        percentage: 0
      };
    }
    
    let strength = 0;
    
    // 長さチェック
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // 複雑さチェック
    if (/[a-z]/.test(password)) strength += 1; // 小文字
    if (/[A-Z]/.test(password)) strength += 1; // 大文字
    if (/[0-9]/.test(password)) strength += 1; // 数字
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1; // 特殊文字
    
    // 強度の表示内容を決定
    const strengthMap = [
      { text: '非常に弱い', className: 'very-weak', percentage: 20 },
      { text: '弱い', className: 'weak', percentage: 40 },
      { text: '普通', className: 'medium', percentage: 60 },
      { text: '強い', className: 'strong', percentage: 80 },
      { text: '非常に強い', className: 'very-strong', percentage: 100 }
    ];
    
    // 強度スコア（0-6）を5段階（0-4）に変換
    const index = Math.min(Math.floor(strength / 6 * 5), 4);
    return strengthMap[index];
  }

  // パスワード表示切り替え
  const togglePasswordButtons = document.querySelectorAll('.toggle-password');
  
  togglePasswordButtons.forEach(button => {
    button.addEventListener('click', function() {
      const passwordInput = this.previousElementSibling;
      
      // パスワードの表示/非表示を切り替え
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        this.innerHTML = '<i class="fas fa-eye-slash"></i>';
      } else {
        passwordInput.type = 'password';
        this.innerHTML = '<i class="fas fa-eye"></i>';
      }
    });
  });

  // プロフィール画像プレビュー
  const profileImageInput = document.getElementById('profile-image');
  const profileImagePreview = document.getElementById('image-preview');
  
  if (profileImageInput && profileImagePreview) {
    profileImageInput.addEventListener('change', function() {
      const file = this.files[0];
      
      if (file) {
        const reader = new FileReader();
        
        reader.addEventListener('load', function() {
          profileImagePreview.src = this.result;
        });
        
        reader.readAsDataURL(file);
      }
    });
  }

  // マッチングカードのスワイプアクション
  const matchCards = document.querySelectorAll('.match-card');
  
  if (matchCards.length > 0) {
    matchCards.forEach(card => {
      let startX, moveX;
      
      // タッチイベント
      card.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
      });
      
      card.addEventListener('touchmove', function(e) {
        moveX = e.touches[0].clientX;
        const diffX = moveX - startX;
        
        // カードの回転と移動
        card.style.transform = `translateX(${diffX}px) rotate(${diffX * 0.05}deg)`;
        
        // 背景色の変更
        if (diffX > 0) {
          card.classList.add('swipe-right');
          card.classList.remove('swipe-left');
        } else if (diffX < 0) {
          card.classList.add('swipe-left');
          card.classList.remove('swipe-right');
        } else {
          card.classList.remove('swipe-left', 'swipe-right');
        }
      });
      
      card.addEventListener('touchend', function() {
        const diffX = moveX - startX;
        
        // スワイプが一定以上の場合
        if (Math.abs(diffX) > 100) {
          const direction = diffX > 0 ? 'right' : 'left';
          
          // スワイプアニメーション
          card.style.transition = 'transform 0.5s ease';
          card.style.transform = `translateX(${direction === 'right' ? 1000 : -1000}px) rotate(${direction === 'right' ? 30 : -30}deg)`;
          
          // カードアクション
          setTimeout(() => {
            handleSwipe(card, direction);
          }, 500);
        } else {
          // 元の位置に戻す
          card.style.transition = 'transform 0.3s ease';
          card.style.transform = '';
          card.classList.remove('swipe-left', 'swipe-right');
        }
      });
      
      // マウスイベント
      card.addEventListener('mousedown', function(e) {
        startX = e.clientX;
        
        // マウス移動イベント
        const mouseMoveHandler = function(e) {
          moveX = e.clientX;
          const diffX = moveX - startX;
          
          card.style.transform = `translateX(${diffX}px) rotate(${diffX * 0.05}deg)`;
          
          if (diffX > 0) {
            card.classList.add('swipe-right');
            card.classList.remove('swipe-left');
          } else if (diffX < 0) {
            card.classList.add('swipe-left');
            card.classList.remove('swipe-right');
          } else {
            card.classList.remove('swipe-left', 'swipe-right');
          }
        };
        
        // マウスアップイベント
        const mouseUpHandler = function() {
          document.removeEventListener('mousemove', mouseMoveHandler);
          document.removeEventListener('mouseup', mouseUpHandler);
          
          const diffX = moveX - startX;
          
          if (Math.abs(diffX) > 100) {
            const direction = diffX > 0 ? 'right' : 'left';
            
            card.style.transition = 'transform 0.5s ease';
            card.style.transform = `translateX(${direction === 'right' ? 1000 : -1000}px) rotate(${direction === 'right' ? 30 : -30}deg)`;
            
            setTimeout(() => {
              handleSwipe(card, direction);
            }, 500);
          } else {
            card.style.transition = 'transform 0.3s ease';
            card.style.transform = '';
            card.classList.remove('swipe-left', 'swipe-right');
          }
        };
        
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
      });
      
      // Like/Dislikeボタン
      const likeBtn = card.querySelector('.like-btn');
      const dislikeBtn = card.querySelector('.dislike-btn');
      
      if (likeBtn) {
        likeBtn.addEventListener('click', function() {
          card.style.transition = 'transform 0.5s ease';
          card.style.transform = 'translateX(1000px) rotate(30deg)';
          
          setTimeout(() => {
            handleSwipe(card, 'right');
          }, 500);
        });
      }
      
      if (dislikeBtn) {
        dislikeBtn.addEventListener('click', function() {
          card.style.transition = 'transform 0.5s ease';
          card.style.transform = 'translateX(-1000px) rotate(-30deg)';
          
          setTimeout(() => {
            handleSwipe(card, 'left');
          }, 500);
        });
      }
    });
  }

  // スワイプ処理
  function handleSwipe(card, direction) {
    const userId = card.dataset.userId;
    
    if (direction === 'right') {
      // いいね！処理
      console.log('Liked user:', userId);
      
      // ここにAPIリクエストを追加
      
      // マッチ判定（仮実装）
      const isMatch = Math.random() > 0.7; // 70%の確率でマッチ
      
      if (isMatch) {
        showMatchPopup(userId, card.querySelector('.user-name').textContent);
      }
    } else {
      // スキップ処理
      console.log('Skipped user:', userId);
      
      // ここにAPIリクエストを追加
    }
    
    // カードを非表示
    card.remove();
    
    // 全カードがなくなったらメッセージを表示
    const remainingCards = document.querySelectorAll('.match-card');
    if (remainingCards.length === 0) {
      const noMoreMatches = document.createElement('div');
      noMoreMatches.className = 'no-more-matches';
      noMoreMatches.innerHTML = `
        <div class="no-matches-icon">
          <i class="far fa-frown"></i>
        </div>
        <h3>表示できるプロフィールがありません</h3>
        <p>また後でお試しください。</p>
        <button class="btn btn-primary refresh-btn">更新する</button>
      `;
      
      document.querySelector('.matching-container').appendChild(noMoreMatches);
      
      // 更新ボタン
      const refreshBtn = noMoreMatches.querySelector('.refresh-btn');
      if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
          location.reload();
        });
      }
    }
  }

  // マッチポップアップ表示
  function showMatchPopup(userId, userName) {
    const matchPopup = document.createElement('div');
    matchPopup.className = 'match-popup';
    matchPopup.innerHTML = `
      <div class="match-popup-content">
        <div class="match-popup-header">
          <h3>新しいマッチング！</h3>
          <button class="close-popup"><i class="fas fa-times"></i></button>
        </div>
        <div class="match-popup-body">
          <div class="match-icon">
            <i class="fas fa-heart"></i>
          </div>
          <p><strong>${userName}</strong> さんとマッチングしました！</p>
          <div class="match-buttons">
            <button class="btn btn-outline">後で</button>
            <button class="btn btn-primary" data-user-id="${userId}">メッセージを送る</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(matchPopup);
    
    // ポップアップ表示アニメーション
    setTimeout(() => {
      matchPopup.classList.add('show');
    }, 10);
    
    // 閉じるボタン
    const closeBtn = matchPopup.querySelector('.close-popup');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        matchPopup.classList.remove('show');
        
        setTimeout(() => {
          matchPopup.remove();
        }, 300);
      });
    }
    
    // 「後で」ボタン
    const laterBtn = matchPopup.querySelector('.btn-outline');
    if (laterBtn) {
      laterBtn.addEventListener('click', function() {
        matchPopup.classList.remove('show');
        
        setTimeout(() => {
          matchPopup.remove();
        }, 300);
      });
    }
    
    // 「メッセージを送る」ボタン
    const messageBtn = matchPopup.querySelector('.btn-primary');
    if (messageBtn) {
      messageBtn.addEventListener('click', function() {
        window.location.href = `messages.html?user=${userId}`;
      });
    }
  }

  // フィルター表示切り替え
  const filterToggleBtn = document.querySelector('.filter-toggle');
  const filterContainer = document.querySelector('.filter-container');
  
  if (filterToggleBtn && filterContainer) {
    filterToggleBtn.addEventListener('click', function() {
      filterContainer.classList.toggle('show');
      
      this.querySelector('i').classList.toggle('fa-chevron-down');
      this.querySelector('i').classList.toggle('fa-chevron-up');
    });
  }

  // メッセージサイドバーの表示切り替え（モバイル）
  const chatMobileToggle = document.querySelector('.chat-mobile-toggle');
  const messageSidebar = document.querySelector('.message-sidebar');
  
  if (chatMobileToggle && messageSidebar) {
    chatMobileToggle.addEventListener('click', function() {
      messageSidebar.classList.toggle('show');
    });
  }

  // 会話アイテムクリック処理
  const conversationItems = document.querySelectorAll('.conversation-item');
  
  if (conversationItems.length > 0) {
    conversationItems.forEach(item => {
      item.addEventListener('click', function() {
        // 会話アイテムをアクティブにする
        conversationItems.forEach(item => item.classList.remove('active'));
        this.classList.add('active');
        
        // モバイルでサイドバーを非表示にする
        if (window.innerWidth < 768 && messageSidebar) {
          messageSidebar.classList.remove('show');
        }
        
        // ユーザーIDの取得
        const userId = this.dataset.userId;
        
        // チャットの表示（ここでは簡易実装）
        loadChatMessages(userId);
      });
    });
  }

  // チャットメッセージの読み込み（仮実装）
  function loadChatMessages(userId) {
    const chatHeader = document.querySelector('.chat-header');
    const chatMessages = document.querySelector('.chat-messages');
    
    if (chatHeader && chatMessages) {
      // 選択されたユーザーの会話アイテム
      const selectedItem = document.querySelector(`.conversation-item[data-user-id="${userId}"]`);
      
      if (selectedItem) {
        // ヘッダー情報の更新
        const avatarSrc = selectedItem.querySelector('.conversation-avatar').src;
        const userName = selectedItem.querySelector('.conversation-name').textContent;
        
        chatHeader.innerHTML = `
          <img src="${avatarSrc}" alt="${userName}" class="chat-header-avatar">
          <div class="chat-header-info">
            <h4 class="chat-header-name">${userName}</h4>
            <p class="chat-header-status">オンライン</p>
          </div>
          <div class="chat-header-actions">
            <button><i class="fas fa-phone"></i></button>
            <button><i class="fas fa-video"></i></button>
            <button><i class="fas fa-ellipsis-v"></i></button>
          </div>
        `;
        
        // メッセージのサンプル（実際はAPIから取得）
        chatMessages.innerHTML = `
          <div class="message message-received">
            <div class="message-content">こんにちは！</div>
            <div class="message-time">14:20</div>
          </div>
          <div class="message message-sent">
            <div class="message-content">はじめまして！よろしくお願いします。</div>
            <div class="message-time">14:22</div>
          </div>
          <div class="message message-received">
            <div class="message-content">プロフィール見ました！趣味が似てますね。</div>
            <div class="message-time">14:25</div>
          </div>
          <div class="message message-sent">
            <div class="message-content">本当ですね！映画好きなんですか？</div>
            <div class="message-time">14:28</div>
          </div>
          <div class="message message-received">
            <div class="message-content">はい、特に洋画が好きです。最近見た映画はありますか？</div>
            <div class="message-time">14:30</div>
          </div>
        `;
        
        // スクロールを一番下に
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }
  }

  // メッセージ送信処理
  const messageForm = document.querySelector('.chat-input form');
  
  if (messageForm) {
    messageForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const messageInput = this.querySelector('.message-input');
      const message = messageInput.value.trim();
      
      if (message) {
        sendMessage(message);
        messageInput.value = '';
      }
    });
  }

  // メッセージ送信（仮実装）
  function sendMessage(message) {
    const chatMessages = document.querySelector('.chat-messages');
    
    if (chatMessages) {
      // 現在時刻を取得
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      
      // メッセージ要素を作成
      const messageElement = document.createElement('div');
      messageElement.className = 'message message-sent';
      messageElement.innerHTML = `
        <div class="message-content">${message}</div>
        <div class="message-time">${timeString}</div>
      `;
      
      // メッセージを追加
      chatMessages.appendChild(messageElement);
      
      // スクロールを一番下に
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      // サーバーへの送信（ここでは擬似的に）
      setTimeout(() => {
        // 自動返信（実際はサーバーからのレスポンス）
        if (Math.random() > 0.5) {
          const replies = [
            'なるほど、興味深いですね！',
            'それはいいですね！',
            'もっと詳しく教えてください！',
            'わかります！私もそう思います。',
            'それについて今度会って話しませんか？'
          ];
          
          const randomReply = replies[Math.floor(Math.random() * replies.length)];
          
          const replyElement = document.createElement('div');
          replyElement.className = 'message message-received';
          replyElement.innerHTML = `
            <div class="message-content">${randomReply}</div>
            <div class="message-time">${timeString}</div>
          `;
          
          chatMessages.appendChild(replyElement);
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }
      }, 1000 + Math.random() * 2000);
    }
  }

  // プロフィール編集の変更保存
  const profileEditForm = document.getElementById('profile-edit-form');
  
  if (profileEditForm) {
    profileEditForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // 保存中の表示
      const submitBtn = this.querySelector('[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = '保存中...';
      submitBtn.disabled = true;
      
      // フォームデータの収集（APIに送信する形）
      const formData = new FormData(this);
      
      // APIリクエストの擬似的な遅延（実際はサーバーに送信）
      setTimeout(() => {
        // 成功メッセージ表示
        const successMessage = document.createElement('div');
        successMessage.className = 'alert alert-success';
        successMessage.textContent = 'プロフィールを更新しました！';
        
        profileEditForm.prepend(successMessage);
        
        // ボタンを元に戻す
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // 3秒後にメッセージを消す
        setTimeout(() => {
          successMessage.remove();
        }, 3000);
      }, 1500);
    });
  }

  // すべてのソート機能
  const sortSelects = document.querySelectorAll('.sort-select');
  
  sortSelects.forEach(select => {
    select.addEventListener('change', function() {
      // ソート処理（実際にはAPIリクエストかフロントエンドでのソート）
      console.log('Sort by:', this.value);
      
      // ページをリロード（または特定のDOMを更新）
      // window.location.href = window.location.pathname + '?sort=' + this.value;
    });
  });

  // フィルター適用
  const filterForm = document.getElementById('filter-form');
  
  if (filterForm) {
    filterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // フィルターデータの収集
      const formData = new FormData(this);
      const filters = {};
      
      for (const [key, value] of formData.entries()) {
        filters[key] = value;
      }
      
      // フィルター適用（APIリクエストの代わりに）
      console.log('Applied filters:', filters);
      
      // フィルターコンテナを閉じる（モバイル）
      const filterContainer = document.querySelector('.filter-container');
      if (filterContainer && window.innerWidth < 768) {
        filterContainer.classList.remove('show');
      }
      
      // UIにフィルター適用中の表示
      const activeFiltersContainer = document.querySelector('.active-filters');
      if (activeFiltersContainer) {
        let filterHTML = '';
        
        for (const key in filters) {
          if (filters[key]) {
            const filterName = document.querySelector(`label[for="${key}"]`)?.textContent || key;
            filterHTML += `<span class="active-filter">${filterName}: ${filters[key]} <button class="remove-filter" data-filter="${key}"><i class="fas fa-times"></i></button></span>`;
          }
        }
        
        if (filterHTML) {
          activeFiltersContainer.innerHTML = filterHTML + '<button class="clear-all-filters">すべて解除</button>';
          activeFiltersContainer.style.display = 'flex';
          
          // フィルター解除ボタン
          const removeButtons = activeFiltersContainer.querySelectorAll('.remove-filter');
          removeButtons.forEach(button => {
            button.addEventListener('click', function() {
              const filterKey = this.dataset.filter;
              const filterInput = document.querySelector(`[name="${filterKey}"]`);
              
              if (filterInput) {
                filterInput.value = '';
                filterForm.dispatchEvent(new Event('submit'));
              }
            });
          });
          
          // すべて解除ボタン
          const clearAllButton = activeFiltersContainer.querySelector('.clear-all-filters');
          if (clearAllButton) {
            clearAllButton.addEventListener('click', function() {
              filterForm.reset();
              filterForm.dispatchEvent(new Event('submit'));
            });
          }
        } else {
          activeFiltersContainer.innerHTML = '';
          activeFiltersContainer.style.display = 'none';
        }
      }
    });
  }

  // スクロールトップボタン
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.className = 'scroll-top-btn';
  scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  document.body.appendChild(scrollTopBtn);
  
  // スクロール位置によって表示/非表示
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  });
  
  // クリックで上にスクロール
  scrollTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // 通知ドロップダウン
  const notificationBtn = document.querySelector('.notification-btn');
  const notificationDropdown = document.querySelector('.notification-dropdown');
  
  if (notificationBtn && notificationDropdown) {
    notificationBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      notificationDropdown.classList.toggle('show');
    });
    
    // 外側をクリックしたら閉じる
    document.addEventListener('click', function(e) {
      if (!notificationDropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
        notificationDropdown.classList.remove('show');
      }
    });
  }
}); 