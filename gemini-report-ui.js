/**
 * Gemini レポート生成システム - UI制御スクリプト
 */

// DOM要素
const elements = {
    // フォーム要素
    form: document.getElementById('report-form'),
    geminiApiKey: document.getElementById('gemini-api-key'),
    searchApiKey: document.getElementById('search-api-key'),
    searchEngineId: document.getElementById('search-engine-id'),
    topic: document.getElementById('topic'),
    description: document.getElementById('description'),
    academicLevel: document.getElementById('academic-level'),
    wordCount: document.getElementById('word-count'),
    
    // ボタン
    generateBtn: document.getElementById('generate-button'),
    copyBtn: document.getElementById('copy-button'),
    downloadBtn: document.getElementById('download-button'),
    
    // タブ
    statusTab: document.getElementById('status-tab'),
    reportTab: document.getElementById('report-tab'),
    searchTab: document.getElementById('search-tab'),
    
    // 出力コンテナ
    statusMessage: document.getElementById('status-message'),
    logContainer: document.getElementById('log-content'),
    reportDisplay: document.getElementById('report-display'),
    searchTermsContainer: document.getElementById('search-terms-container'),
    searchResultsContainer: document.getElementById('search-results-container'),
    
    // ローディング要素
    loadingOverlay: document.getElementById('loading-overlay'),
    loadingMessage: document.getElementById('loading-message'),
    
    // 検証結果要素
    validationCard: document.getElementById('validation-card'),
    validationScore: document.getElementById('validation-score').querySelector('.score-value'),
    validationSummary: document.getElementById('validation-summary'),
    validationIssues: document.getElementById('validation-issues')
};

// アプリケーション状態
const state = {
    isGenerating: false,
    currentReport: null,
    validationResults: null,
    useLoadingOverlay: true, // オーバーレイを使用するかどうかのフラグ
    lastUpdateTime: 0        // 最後の状態更新時間を追跡
};

// 初期化処理
document.addEventListener('DOMContentLoaded', () => {
    console.log('Gemini レポート生成システム UI 初期化中...');
    
    // API設定の自動設定 (LocalStorageから復元しない)
    setupEventListeners();

    // オーバーレイの透明度を下げる
    elements.loadingOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';

    console.log('UI 初期化完了');
});

// イベントリスナー設定
function setupEventListeners() {
    // レポート生成ボタン
    elements.generateBtn.addEventListener('click', handleGenerateButtonClick);
    
    // コピーボタン
    elements.copyBtn.addEventListener('click', copyReportToClipboard);
    
    // ダウンロードボタン
    elements.downloadBtn.addEventListener('click', downloadReport);
    
    // フォームのEnterキー押下をボタンクリックと同じ扱いに
    elements.form.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleGenerateButtonClick();
        }
    });

    // オーバーレイ表示設定
    const overlayToggle = document.getElementById('overlay-toggle');
    if (overlayToggle) {
        overlayToggle.addEventListener('change', (e) => {
            state.useLoadingOverlay = e.target.checked;
            console.log(`オーバーレイ表示: ${state.useLoadingOverlay ? 'オン' : 'オフ'}`);
        });
    }
    
    // 詳細設定の表示/非表示
    const advancedSettingsToggle = document.getElementById('advanced-settings-toggle');
    const advancedSettings = document.getElementById('advanced-settings');
    if (advancedSettingsToggle && advancedSettings) {
        advancedSettingsToggle.addEventListener('click', () => {
            if (advancedSettings.style.display === 'none') {
                advancedSettings.style.display = 'block';
                advancedSettingsToggle.textContent = '詳細設定を隠す';
            } else {
                advancedSettings.style.display = 'none';
                advancedSettingsToggle.textContent = '詳細設定';
            }
        });
    }

    // クリップボードに関するメッセージのリセット用
    elements.reportTab.addEventListener('shown.bs.tab', () => {
        if (elements.copyBtn.innerHTML.includes('コピーしました')) {
            setTimeout(() => {
                elements.copyBtn.innerHTML = '<i class="bi bi-clipboard"></i> コピー';
            }, 500);
        }
    });
}

// API設定の保存（非表示になっているので使用されない）
function saveApiKeys() {
    const geminiApiKey = elements.geminiApiKey.value.trim();
    const searchApiKey = elements.searchApiKey.value.trim();
    const searchEngineId = elements.searchEngineId.value.trim();
    
    if (geminiApiKey) {
        localStorage.setItem('geminiApiKey', geminiApiKey);
    }
    
    if (searchApiKey) {
        localStorage.setItem('searchApiKey', searchApiKey);
    }
    
    if (searchEngineId) {
        localStorage.setItem('searchEngineId', searchEngineId);
    }
}

// レポート生成ボタンのクリックハンドラ
function handleGenerateButtonClick() {
    if (state.isGenerating) return;
    
    // フォーム検証
    const isValid = validateForm();
    if (!isValid) return;
    
    // UIを生成中の状態に更新
    state.isGenerating = true;
    state.lastUpdateTime = Date.now();
    updateUIForGenerating(true);
    
    // レポートシステムの設定
    setupReportSystem();
    
    // タイマースタート
    const startTime = new Date();
    
    // レポート生成開始
    startReportGeneration()
        .then(() => {
            // 処理完了時間の計算
            const endTime = new Date();
            const processTime = Math.round((endTime - startTime) / 1000);
            
            // 生成完了表示
            addLogMessage(`レポート生成が完了しました（処理時間: ${processTime}秒）`);
            updateStatusMessage(`レポートが正常に生成されました！`, 'success');
            
            // レポートタブを表示
            showTabContent('report-tab');
        })
        .catch(error => {
            console.error('レポート生成エラー:', error);
            
            // エラー表示
            let errorMessage = error.message;
            
            // 特定のエラーメッセージをユーザーフレンドリーに変更
            if (errorMessage.includes('十分な検索結果が得られませんでした')) {
                errorMessage = '検索結果の取得に問題がありました。インターネット接続やAPIキーを確認してください。別のトピックで試すこともできます。ただし、一般的な情報を使用してレポート生成を試みます。';
                
                // 自動的に再試行
                setTimeout(() => {
                    addLogMessage('検索結果なしでレポート生成を再試行します...', 'warning');
                    startReportGeneration()
                        .then(() => {
                            addLogMessage('一般情報を使用したレポート生成が完了しました', 'success');
                            updateStatusMessage('一般情報を使用してレポートを生成しました', 'warning');
                            showTabContent('report-tab');
                        })
                        .catch(retryError => {
                            addLogMessage(`再試行中にエラーが発生しました: ${retryError.message}`, 'error');
                        })
                        .finally(() => {
                            state.isGenerating = false;
                            updateUIForGenerating(false);
                        });
                }, 2000);
                
                // エラーメッセージに再試行中であることを追加
                errorMessage += ' 自動的に再試行しています...';
            } else if (errorMessage.includes('API')) {
                errorMessage = 'APIの呼び出しに問題がありました。しばらく待ってから再試行してください。';
            }
            
            addLogMessage(`エラーが発生しました: ${errorMessage}`, 'error');
            updateStatusMessage(`エラー: ${errorMessage}`, 'danger');
        })
        .finally(() => {
            // UI状態の復元（自動再試行の場合を除く）
            if (!error || !error.message || !error.message.includes('十分な検索結果が得られませんでした')) {
                state.isGenerating = false;
                updateUIForGenerating(false);
            }
        });
    
    // 安全装置: 5分後に強制的にローディング状態を解除
    setTimeout(() => {
        if (state.isGenerating && Date.now() - state.lastUpdateTime > 30000) {
            addLogMessage('長時間の処理が検出されたため、ローディング状態を解除します', 'warning');
            state.isGenerating = false;
            updateUIForGenerating(false);
        }
    }, 300000); // 5分 = 300,000ミリ秒
}

// フォーム検証
function validateForm() {
    // 全フォーム要素のバリデーションクラスをリセット
    elements.form.classList.remove('was-validated');
    
    // APIキーは事前設定済みのため検証不要
    
    // 必須項目のチェック
    let isValid = true;
    
    // トピックの検証
    if (!elements.topic.value.trim()) {
        elements.topic.classList.add('is-invalid');
        isValid = false;
    } else {
        elements.topic.classList.remove('is-invalid');
    }
    
    // 検証結果をUIに反映
    elements.form.classList.add('was-validated');
    
    if (!isValid) {
        updateStatusMessage('入力内容を確認してください', 'warning');
    }
    
    return isValid;
}

// レポートシステムのセットアップ
function setupReportSystem() {
    // API設定の取得（すでに埋め込み済み）
    const geminiApiKey = elements.geminiApiKey.value.trim();
    const searchApiKey = elements.searchApiKey.value.trim();
    const searchEngineId = elements.searchEngineId.value.trim();
    
    // ステータス更新コールバック
    window.reportSystem = new GeminiReportSystem(
        geminiApiKey, 
        searchApiKey, 
        searchEngineId, 
        handleStatusUpdate
    );
    
    console.log('レポートシステムを初期化しました');
}

// レポート生成プロセスの開始
async function startReportGeneration() {
    // レポートシステム、トピック、設定の確認
    if (!window.reportSystem) {
        throw new Error('レポートシステムが初期化されていません');
    }
    
    const topic = elements.topic.value.trim();
    if (!topic) {
        throw new Error('トピックが入力されていません');
    }
    
    // UI初期化
    elements.reportDisplay.innerHTML = '<p class="text-muted">レポートを生成中...</p>';
    elements.searchTermsContainer.innerHTML = '<p class="text-muted">検索ワードを生成中...</p>';
    elements.searchResultsContainer.innerHTML = '<p class="text-muted">検索中...</p>';
    elements.logContainer.innerHTML = '';
    elements.validationCard.classList.add('d-none');
    
    // オプション設定
    const options = {
        topic: topic,
        description: elements.description.value.trim(),
        academicLevel: elements.academicLevel.value,
        wordCount: elements.wordCount.value
    };
    
    try {
        addLogMessage('レポート生成プロセスを開始します');
        
        // 最大3回まで再試行
        let attempts = 0;
        let maxAttempts = 2;
        let report = null;
        let lastError = null;
        
        while (attempts <= maxAttempts) {
            try {
                // レポート生成の実行
                if (attempts > 0) {
                    addLogMessage(`再試行 ${attempts}/${maxAttempts}...`, 'warning');
                }
                
                report = await window.reportSystem.generateReport(options);
                // 成功したらループを抜ける
                break;
            } catch (error) {
                lastError = error;
                console.error(`試行 ${attempts + 1} 失敗:`, error);
                
                // 検索結果エラーの場合は再試行せず、そのままエラーを投げる
                if (error.message.includes('十分な検索結果が得られませんでした')) {
                    throw error;
                }
                
                // API関連のエラーのみ再試行
                if (error.message.includes('API') || error.message.includes('レポートの生成に失敗しました')) {
                    attempts++;
                    // 最大試行回数に達した場合はエラーを投げる
                    if (attempts > maxAttempts) {
                        throw error;
                    }
                    // 少し待機してから再試行
                    await new Promise(resolve => setTimeout(resolve, 2000));
                } else {
                    // その他のエラーは再試行せず、そのままエラーを投げる
                    throw error;
                }
            }
        }
        
        // 最終的に失敗した場合
        if (!report) {
            throw lastError || new Error('不明なエラーでレポート生成に失敗しました');
        }
        
        // 生成されたレポートを状態に保存
        state.currentReport = report;
        
        // 結果をUIに表示
        updateReportDisplay(report);
        
        return report;
    } catch (error) {
        console.error('レポート生成エラー:', error);
        throw error;
    }
}

// ステータス更新のハンドラ
function handleStatusUpdate(update) {
    console.log('ステータス更新:', update);
    
    // 状態更新時間を記録
    state.lastUpdateTime = Date.now();
    
    // ステータスメッセージの更新
    if (update.message) {
        updateStatusMessage(update.message, update.type || 'info');
    }
    
    // ローディングメッセージの更新
    if (update.loadingMessage) {
        elements.loadingMessage.textContent = update.loadingMessage;
    }
    
    // ログメッセージの追加
    if (update.logMessage) {
        addLogMessage(update.logMessage, update.type);
    }
    
    // 検索ワードの更新
    if (update.searchTerms) {
        updateSearchTermsDisplay(update.searchTerms);
    }
    
    // 検索結果の更新
    if (update.searchResults) {
        updateSearchResultsDisplay(update.searchResults);
    }
    
    // レポート内容の更新
    if (update.reportContent) {
        updateReportDisplay(update.reportContent);
    }
    
    // 検証結果の更新
    if (update.validationResults) {
        updateValidationDisplay(update.validationResults);
        
        // レポート改善プロセスが完了したことを検知して状態をリセット
        if (update.type === 'success' && update.message && update.message.includes('完了')) {
            state.isGenerating = false;
            updateUIForGenerating(false);
        }
    }
}

// 生成中のUI状態更新
function updateUIForGenerating(isGenerating) {
    // ボタンの有効/無効切り替え
    elements.generateBtn.disabled = isGenerating;
    
    // ローディングオーバーレイの表示/非表示切り替え
    if (isGenerating && state.useLoadingOverlay) {
        elements.loadingOverlay.classList.remove('d-none');
    } else {
        elements.loadingOverlay.classList.add('d-none');
    }
    
    // コピー・ダウンロードボタンの更新
    elements.copyBtn.disabled = !state.currentReport;
    elements.downloadBtn.disabled = !state.currentReport;
}

// ステータスメッセージの更新
function updateStatusMessage(message, type = 'info') {
    elements.statusMessage.innerHTML = message;
    
    // アラートタイプのリセット
    elements.statusMessage.className = '';
    elements.statusMessage.classList.add('alert');
    
    // アラートタイプの設定
    switch (type) {
        case 'success':
            elements.statusMessage.classList.add('alert-success');
            break;
        case 'warning':
            elements.statusMessage.classList.add('alert-warning');
            break;
        case 'danger':
        case 'error':
            elements.statusMessage.classList.add('alert-danger');
            break;
        default:
            elements.statusMessage.classList.add('alert-info');
    }
}

// ログメッセージの追加
function addLogMessage(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logItem = document.createElement('div');
    logItem.className = 'log-item';
    
    if (type === 'error' || type === 'danger') {
        logItem.classList.add('log-error');
    } else if (type === 'warning') {
        logItem.classList.add('log-warning');
    } else if (type === 'success') {
        logItem.classList.add('log-success');
    }
    
    logItem.innerHTML = `<span class="log-time">${timestamp}</span> ${message}`;
    
    elements.logContainer.appendChild(logItem);
    
    // 自動スクロールを最下部に
    elements.logContainer.scrollTop = elements.logContainer.scrollHeight;
}

// レポート表示の更新
function updateReportDisplay(content) {
    if (!content) {
        elements.reportDisplay.innerHTML = '<p class="text-muted">レポートはまだ生成されていません...</p>';
        return;
    }
    
    // Markdownをレンダリング
    elements.reportDisplay.innerHTML = formatReportContent(content);
    
    // ボタンを有効化
    elements.copyBtn.disabled = false;
    elements.downloadBtn.disabled = false;
}

// レポート内容のフォーマット（Markdown → HTML）
function formatReportContent(markdown) {
    if (!markdown) return '';
    
    // 基本的なMarkdown変換（より高度な変換ライブラリを使ってもよい）
    let html = markdown
        // 見出し
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
        
        // 段落
        .replace(/^\s*(\n)?(.+)/gm, function(m) {
            return /\<(\/)?(h\d|ul|ol|li|blockquote|pre|img)/.test(m) ? m : '<p>' + m + '</p>';
        })
        
        // 太字
        .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
        
        // 斜体
        .replace(/\*(.*)\*/g, '<em>$1</em>')
        
        // 引用
        .replace(/^\> (.*$)/gm, '<blockquote>$1</blockquote>')
        
        // 箇条書きリスト
        .replace(/^\s*\- (.*)/gm, '<ul><li>$1</li></ul>')
        
        // 番号付きリスト
        .replace(/^\s*\d+\. (.*)/gm, '<ol><li>$1</li></ol>')
        
        // リンク
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
        
        // 連続するリスト要素を結合
        .replace(/<\/ul>\s*<ul>/g, '')
        .replace(/<\/ol>\s*<ol>/g, '')
        
        // 改行
        .replace(/\n/g, '<br>');
    
    return html;
}

// 検索ワード表示の更新
function updateSearchTermsDisplay(searchTerms) {
    if (!searchTerms || searchTerms.length === 0) {
        elements.searchTermsContainer.innerHTML = '<p class="text-muted">検索ワードはまだ生成されていません...</p>';
        return;
    }
    
    // 検索ワードを言語別に分類（日本語/英語）
    const japaneseTerms = [];
    const englishTerms = [];
    
    searchTerms.forEach(term => {
        // 日本語が含まれているかチェック
        if (/[\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF]/.test(term)) {
            japaneseTerms.push(term);
        } else {
            englishTerms.push(term);
        }
    });
    
    // 表示用HTML生成
    let html = '<div class="search-terms">';
    
    if (japaneseTerms.length > 0) {
        html += '<div class="search-terms-group mb-3">';
        html += '<h6>日本語検索ワード</h6>';
        html += '<ul class="list-group">';
        japaneseTerms.forEach(term => {
            html += `<li class="list-group-item search-term">${term}</li>`;
        });
        html += '</ul>';
        html += '</div>';
    }
    
    if (englishTerms.length > 0) {
        html += '<div class="search-terms-group mb-3">';
        html += '<h6>英語検索ワード</h6>';
        html += '<ul class="list-group">';
        englishTerms.forEach(term => {
            html += `<li class="list-group-item search-term">${term}</li>`;
        });
        html += '</ul>';
        html += '</div>';
    }
    
    html += '</div>';
    
    elements.searchTermsContainer.innerHTML = html;
}

// 検索結果表示の更新
function updateSearchResultsDisplay(searchResults) {
    if (!searchResults || searchResults.length === 0) {
        elements.searchResultsContainer.innerHTML = '<div class="alert alert-warning">検索結果が取得できませんでした。トピックに関する一般的な情報を使用してレポートを作成します。</div>';
        return;
    }
    
    // ダミーの検索結果かどうかをチェック
    const hasDummyResults = searchResults.some(result => 
        result.link === "https://example.com/general-knowledge" || 
        result.link === "https://example.com" ||
        result.displayLink === "一般情報ソース" ||
        result.displayLink === "情報ソースなし"
    );
    
    if (hasDummyResults) {
        elements.searchResultsContainer.innerHTML = `
            <div class="alert alert-warning">
                <h5><i class="bi bi-exclamation-triangle"></i> 検索結果の取得に制限がありました</h5>
                <p>十分な検索結果が得られなかったため、トピックに関する一般的な情報も使用してレポートを作成します。</p>
                <p>考えられる原因:</p>
                <ul>
                    <li>インターネット接続の問題</li>
                    <li>Google検索APIの制限やクォータ</li>
                    <li>検索ワードに対する結果の少なさ</li>
                </ul>
                <p>得られた検索結果と一般的な知識を組み合わせてレポートを作成します。</p>
            </div>
        `;
        
        // 実際の検索結果があればそれも表示
        const realResults = searchResults.filter(result => 
            result.link !== "https://example.com/general-knowledge" && 
            result.link !== "https://example.com" &&
            result.displayLink !== "一般情報ソース" &&
            result.displayLink !== "情報ソースなし"
        );
        
        if (realResults.length > 0) {
            let html = '<div class="search-results mt-4"><h6>取得できた検索結果:</h6>';
            
            realResults.forEach(result => {
                html += `
                    <div class="search-result-item card mb-2">
                        <div class="card-body">
                            <h5 class="search-result-title card-title">${result.title}</h5>
                            <div class="search-result-link">
                                <a href="${result.link}" target="_blank" class="card-link">${result.displayLink || result.link}</a>
                            </div>
                            <p class="search-result-snippet card-text mt-2">${result.snippet}</p>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
            elements.searchResultsContainer.innerHTML += html;
        }
        
        return;
    }
    
    // 通常の検索結果表示処理
    // 検索ワード別に結果をグループ化
    const resultsByTerm = {};
    
    searchResults.forEach(result => {
        const term = result.searchTerm || '不明';
        
        if (!resultsByTerm[term]) {
            resultsByTerm[term] = [];
        }
        
        resultsByTerm[term].push(result);
    });
    
    // 表示用HTML生成
    let html = '<div class="search-results">';
    
    // 各検索ワードごとに結果を表示
    Object.keys(resultsByTerm).forEach(term => {
        const results = resultsByTerm[term];
        
        html += `<div class="search-results-group mb-4">`;
        html += `<h6>「${term}」の検索結果 (${results.length}件)</h6>`;
        
        results.forEach(result => {
            html += `
                <div class="search-result-item card mb-2">
                    <div class="card-body">
                        <h5 class="search-result-title card-title">${result.title}</h5>
                        <div class="search-result-link">
                            <a href="${result.link}" target="_blank" class="card-link">${result.displayLink || result.link}</a>
                        </div>
                        <p class="search-result-snippet card-text mt-2">${result.snippet}</p>
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
    });
    
    html += '</div>';
    
    elements.searchResultsContainer.innerHTML = html;
}

// 検証結果表示の更新
function updateValidationDisplay(validationResult) {
    if (!validationResult) {
        elements.validationCard.classList.add('d-none');
        return;
    }
    
    // 検証カードを表示
    elements.validationCard.classList.remove('d-none');
    
    // スコアの更新
    const score = validationResult.score || 0;
    elements.validationScore.textContent = score;
    
    // スコアに応じたスタイル変更
    if (score >= 80) {
        elements.validationScore.parentNode.className = 'validation-score score-high';
    } else if (score >= 60) {
        elements.validationScore.parentNode.className = 'validation-score score-medium';
    } else {
        elements.validationScore.parentNode.className = 'validation-score score-low';
    }
    
    // サマリーテキストの更新
    if (validationResult.needsImprovement) {
        elements.validationSummary.textContent = '改善が必要です';
        elements.validationSummary.className = 'validation-summary text-warning';
    } else {
        elements.validationSummary.textContent = '合格';
        elements.validationSummary.className = 'validation-summary text-success';
    }
    
    // 問題点リストの更新
    elements.validationIssues.innerHTML = '';
    
    if (validationResult.issues && validationResult.issues.length > 0) {
        validationResult.issues.forEach(issue => {
            const issueItem = document.createElement('li');
            issueItem.className = 'list-group-item issue-item';
            
            // 重要度に応じたスタイル
            if (issue.severity === '高') {
                issueItem.classList.add('issue-high');
            } else if (issue.severity === '中') {
                issueItem.classList.add('issue-medium');
            } else {
                issueItem.classList.add('issue-low');
            }
            
            issueItem.innerHTML = `
                <div class="issue-header">
                    <span class="issue-title">${issue.title || '問題'}</span>
                    <span class="issue-severity badge ${issue.severity === '高' ? 'bg-danger' : issue.severity === '中' ? 'bg-warning' : 'bg-info'}">${issue.severity}</span>
                </div>
                <div class="issue-description">${issue.description}</div>
            `;
            
            elements.validationIssues.appendChild(issueItem);
        });
    } else {
        const noIssuesItem = document.createElement('li');
        noIssuesItem.className = 'list-group-item text-success';
        noIssuesItem.textContent = '問題は検出されませんでした';
        elements.validationIssues.appendChild(noIssuesItem);
    }
}

// タブコンテンツの表示
function showTabContent(tabId) {
    const tab = document.getElementById(tabId);
    const tabInstance = new bootstrap.Tab(tab);
    tabInstance.show();
}

// レポートをクリップボードにコピー
function copyReportToClipboard() {
    if (!state.currentReport) {
        addLogMessage('コピーするレポートがありません', 'warning');
        return;
    }
    
    try {
        navigator.clipboard.writeText(state.currentReport)
            .then(() => {
                elements.copyBtn.innerHTML = '<i class="bi bi-check"></i> コピーしました';
                addLogMessage('レポートをクリップボードにコピーしました', 'success');
                
                // 3秒後に元に戻す
                setTimeout(() => {
                    elements.copyBtn.innerHTML = '<i class="bi bi-clipboard"></i> コピー';
                }, 3000);
            })
            .catch(err => {
                console.error('クリップボードへのコピーに失敗しました:', err);
                addLogMessage('クリップボードへのコピーに失敗しました', 'error');
            });
    } catch (err) {
        console.error('クリップボードへのコピーに失敗しました:', err);
        addLogMessage('クリップボードへのコピーに失敗しました', 'error');
    }
}

// レポートのダウンロード
function downloadReport() {
    if (!state.currentReport) {
        addLogMessage('ダウンロードするレポートがありません', 'warning');
        return;
    }
    
    try {
        // ファイル名の生成（日本語部分を除去して英数字のみに）
        const filename = `report_${elements.topic.value.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_').substring(0, 30)}_${new Date().toISOString().slice(0, 10)}.txt`;
        
        // BlobとURLの作成
        const blob = new Blob([state.currentReport], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        // ダウンロードリンク生成
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        
        // クリックしてダウンロード開始
        a.click();
        
        // クリーンアップ
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
        
        addLogMessage(`レポートを「${filename}」としてダウンロードしました`, 'success');
    } catch (err) {
        console.error('レポートのダウンロードに失敗しました:', err);
        addLogMessage('レポートのダウンロードに失敗しました', 'error');
    }
} 