/**
 * Gemini 自律型レポート生成システム
 * Gemini APIとGoogle Search APIを使用して
 * 自動的にレポートを作成するシステム
 */
class GeminiReportSystem {
    /**
     * コンストラクタ
     * @param {string} geminiApiKey Gemini APIキー
     * @param {string} searchApiKey Google Search APIキー
     * @param {string} searchEngineId Google カスタム検索エンジンID
     * @param {Function} statusCallback ステータス更新コールバック関数
     */
    constructor(geminiApiKey = null, searchApiKey = null, searchEngineId = null, statusCallback = null) {
        // API設定
        this.geminiApiKey = geminiApiKey || 'AIzaSyD8jqgFnk9r9gUavkiNL8qqHIMu9eejhhs';
        this.searchApiKey = searchApiKey || 'AIzaSyAe2I4BTuPH8xAjsTUaN2ALMAQ8MRZM3yQ';
        this.searchEngineId = searchEngineId || 'a42eafca39221487a';
        
        // ステータス更新コールバック
        this.statusCallback = statusCallback;
        
        // 設定
        this.config = {
            maxRetries: 3,           // 最大リトライ回数
            maxSearchResults: 10,     // 検索結果の最大取得数
            validationThreshold: 70,  // 検証の合格基準（70点以上）
            temperature: 0.7          // Gemini生成温度（高いほど創造的だが一貫性が低下）
        };
        
        // 初期化
        this.initialize();
    }
    
    // システムの初期化
    initialize() {
        // 状態管理
        this.state = {
            currentTask: null,       // 現在のタスク
            searchTerms: null,       // 検索ワード
            searchResults: null,     // 検索結果
            reportContent: null,     // レポート内容
            validationResults: null, // 検証結果
            finalReport: null,       // 最終レポート
            errors: []               // エラーログ
        };
        
        // タスク状態をリセット
        this.state.currentTask = 'initialized';
    }
    
    /**
     * レポート生成メインメソッド
     * @param {Object} options オプション
     * @param {string} options.topic レポートトピック
     * @param {string} options.description 詳細説明（オプション）
     * @param {string} options.academicLevel 学術レベル（オプション）
     * @param {string} options.wordCount 希望文字数（オプション）
     * @returns {Promise<string>} 生成されたレポート
     */
    async generateReport(options) {
        try {
            this.initialize();
            
            // オプション整理
            const requirements = {
                description: options.description || '',
                academicLevel: options.academicLevel || '大学学部',
                wordCount: options.wordCount || '1500'
            };
            
            // トピックの確認
            if (!options.topic) {
                const error = new Error('レポートトピックが指定されていません');
                this.updateStatus({
                    message: error.message,
                    logMessage: error.message,
                    type: 'error'
                });
                throw error;
            }
            
            // 1. 検索ワード設定
            this.updateStatus({
                message: '検索ワードを生成中...',
                logMessage: '検索ワードの自律的生成を開始します',
                loadingMessage: '検索ワードを生成中...',
                type: 'info'
            });
            
            await this.determineSearchTerms(options.topic, requirements);
            
            // 2. 情報収集
            this.updateStatus({
                message: '情報を収集中...',
                logMessage: '検索ワードに基づいて情報収集を開始します',
                loadingMessage: '情報を収集中...',
                type: 'info'
            });
            
            await this.collectInformation();
            
            // 3. レポート作成
            this.updateStatus({
                message: 'レポートを作成中...',
                logMessage: '収集した情報に基づいてレポートを作成します',
                loadingMessage: 'レポートを作成中...',
                type: 'info'
            });
            
            await this.createReport(options.topic, requirements);
            
            // 4. レポート検証
            this.updateStatus({
                message: 'レポートの品質を検証中...',
                logMessage: '生成されたレポートの品質を検証します',
                loadingMessage: 'レポート品質を検証中...',
                type: 'info'
            });
            
            await this.validateReport(requirements);
            
            // 5. 必要に応じて改善
            if (this.state.validationResults.needsImprovement) {
                this.updateStatus({
                    message: 'レポートを改善中...',
                    logMessage: '検証結果に基づいてレポートを改善します',
                    loadingMessage: 'レポートを改善中...',
                    type: 'info'
                });
                
                await this.improveReport();
                this.state.reportContent = this.state.finalReport;
            } else {
                this.state.finalReport = this.state.reportContent;
            }
            
            // 6. 最終結果
            this.updateStatus({
                message: 'レポート生成が完了しました',
                logMessage: 'レポート生成プロセスが完了しました',
                type: 'success',
                searchTerms: this.state.searchTerms,
                searchResults: this.state.searchResults,
                reportContent: this.state.finalReport,
                validationResults: this.state.validationResults
            });
            
            return this.state.finalReport;
            
        } catch (error) {
            console.error('レポート生成エラー:', error);
            
            // エラー状態を更新
            this.state.errors.push(error.message);
            
            this.updateStatus({
                message: `エラー: ${error.message}`,
                logMessage: `レポート生成中にエラーが発生しました: ${error.message}`,
                type: 'error'
            });
            
            throw error;
        }
    }
    
    // 3. 検索ワード設定
    async determineSearchTerms(topic, requirements) {
        this.state.currentTask = 'determineSearchTerms';
        
        // プロンプトの構築
        const prompt = `
        あなたは与えられたトピックに関して、効果的な検索ワードを生成する専門家です。
        日本語と英語の両方で、適切な検索ワードを作成してください。
        
        【検索ワード生成の条件】
        - トピックの主要な側面を網羅すること
        - キーワードのみでなく、フレーズも含めること
        - 5-8個の検索ワードを生成すること（日本語と英語の合計で）
        - 日本語キーワードと英語キーワードをバランスよく含めること
        - 具体的で実用的な検索ワードであること
        - 検索エンジンで良い結果が得られそうなものを選ぶこと
        
        【レポートトピック】
        ${topic}
        
        ${requirements.description ? `【詳細説明】\n${requirements.description}\n` : ''}
        ${requirements.academicLevel ? `【学術レベル】\n${requirements.academicLevel}\n` : ''}
        
        【出力形式】
        以下の形式で、番号付きリストとして検索ワードのみを出力してください:
        
        1. [検索ワード1]
        2. [検索ワード2]
        3. [検索ワード3]
        ...
        
        説明や前置きは不要です。検索ワードのリストのみを出力してください。
        `;
        
        // Gemini APIの呼び出し
        const response = await this.callGeminiAPI(prompt);
        
        if (!response) {
            throw new Error('検索ワードの生成に失敗しました');
        }
        
        // レスポンスから検索ワードを抽出
        const searchTerms = this.extractSearchTerms(response);
        
        if (searchTerms.length === 0) {
            throw new Error('有効な検索ワードが見つかりませんでした');
        }
        
        this.updateStatus({
            logMessage: `${searchTerms.length}個の検索ワードが生成されました`,
            searchTerms,
            type: 'success'
        });
        
        this.state.searchTerms = searchTerms;
        return searchTerms;
    }
    
    // 検索ワードの抽出
    extractSearchTerms(response) {
        const lines = response.split('\n');
        const searchTerms = [];
        
        for (const line of lines) {
            const match = line.match(/^\d+[\.\s]+(.+)$/);
            if (match && match[1]) {
                searchTerms.push(match[1].trim());
            }
        }
        
        return searchTerms;
    }
    
    // 4. 情報収集
    async collectInformation() {
        this.state.currentTask = 'collectInformation';
        
        if (!this.state.searchTerms || this.state.searchTerms.length === 0) {
            throw new Error('検索ワードが設定されていません');
        }
        
        // 全ての検索結果を格納する配列
        const allResults = [];
        let searchAttempts = 0;
        let successfulSearches = 0;
        
        // 各検索ワードで検索を実行
        for (const searchTerm of this.state.searchTerms) {
            this.updateStatus({
                message: `「${searchTerm}」で検索中...`,
                logMessage: `検索ワード「${searchTerm}」で情報を収集中...`,
                type: 'info'
            });
            
            searchAttempts++;
            
            try {
                // リトライ処理を追加
                let retryCount = 0;
                let results = [];
                
                while (retryCount < 2) {
                    try {
                        results = await this.searchGoogle(searchTerm);
                        break; // 成功したらループを抜ける
                    } catch (searchError) {
                        retryCount++;
                        if (retryCount >= 2) {
                            throw searchError; // 最大リトライ回数に達したらエラーを投げる
                        }
                        // 少し待ってから再試行
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        this.updateStatus({
                            logMessage: `「${searchTerm}」での検索を再試行しています (${retryCount}/2)...`,
                            type: 'warning'
                        });
                    }
                }
                
                if (results && results.length > 0) {
                    this.updateStatus({
                        logMessage: `「${searchTerm}」で${results.length}件の結果が見つかりました。`,
                        type: 'info'
                    });
                    
                    allResults.push(...results.map(result => ({ ...result, searchTerm })));
                    successfulSearches++;
                } else {
                    this.updateStatus({
                        logMessage: `「${searchTerm}」での検索では結果が見つかりませんでした。他の検索ワードで試します。`,
                        type: 'warning'
                    });
                }
            } catch (error) {
                console.warn(`「${searchTerm}」での検索中にエラーが発生しました:`, error);
                
                this.updateStatus({
                    logMessage: `「${searchTerm}」での検索中にエラーが発生しました: ${error.message}。他の検索ワードで試します。`,
                    type: 'warning'
                });
                
                // 一つの検索ワードのエラーは全体を停止させない
                continue;
            }
        }
        
        // 重複を削除して保存
        this.state.searchResults = this.removeDuplicateResults(allResults);
        
        // 検索結果が少ない場合でも続行する閾値を設定（最低1件あれば続行）
        const minimumResultsThreshold = 1;
        
        // 検索結果が少ない場合は警告を表示するが、エラーとはしない
        if (this.state.searchResults.length < minimumResultsThreshold) {
            // すべての検索が失敗した場合は、ダミーの結果を追加して処理を続行
            this.updateStatus({
                message: `検索結果が少ないですが、一般的な情報でレポートを作成します`,
                logMessage: `検索結果が${this.state.searchResults.length}件しか見つかりませんでしたが、処理を続行します`,
                type: 'warning'
            });
            
            // ダミーの検索結果を追加して処理を続行（既存の結果は保持）
            this.state.searchResults.push({
                title: "一般情報 - " + topic,
                link: "https://example.com/general-knowledge",
                snippet: "検索結果が十分に得られなかったため、トピックに関する一般的な知識も使用してレポートを作成します。",
                displayLink: "一般情報ソース",
                searchTerm: this.state.searchTerms[0] || "一般情報"
            });
        }
        
        return this.state.searchResults;
    }
    
    // Google検索の実行
    async searchGoogle(query) {
        if (!this.searchApiKey || !this.searchEngineId) {
            throw new Error('Google Search APIの設定が不足しています');
        }
        
        try {
            // 検索リクエストの送信
            // タイムアウト対策としてPromise.raceを使用（タイムアウト時間を延長）
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('検索リクエストがタイムアウトしました')), 15000)
            );
            
            const fetchPromise = fetch(
                `https://www.googleapis.com/customsearch/v1?key=${this.searchApiKey}&cx=${this.searchEngineId}&q=${encodeURIComponent(query)}&num=${this.config.maxSearchResults}`,
                { 
                    method: 'GET',
                    // キャッシュ制御を追加
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    }
                }
            );
            
            const response = await Promise.race([fetchPromise, timeoutPromise]);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Google検索APIエラー:', errorText);
                
                // エラーメッセージをより詳細に
                if (response.status === 403) {
                    throw new Error(`Google Search APIのクォータ制限に達したか、APIキーが無効です (${response.status})`);
                } else if (response.status === 429) {
                    throw new Error(`Google Search APIのリクエスト制限に達しました (${response.status})`);
                } else {
                    throw new Error(`Google Search APIリクエストが失敗しました: ${response.status}`);
                }
            }
            
            const data = await response.json();
            
            // 検索結果がない場合は空配列を返す
            if (!data.items || data.items.length === 0) {
                console.warn('検索結果が見つかりませんでした:', query);
                return [];
            }
            
            // 必要な情報だけを抽出
            return data.items.map(item => ({
                title: item.title || '不明なタイトル',
                link: item.link || '#',
                snippet: item.snippet || '説明なし',
                displayLink: item.displayLink || item.link || '不明なリンク'
            }));
        } catch (error) {
            console.error('Google検索中にエラーが発生しました:', error);
            
            // エラーの詳細をログに記録
            this.updateStatus({
                logMessage: `検索エラー詳細: ${error.message}`,
                type: 'warning'
            });
            
            // エラーを上位に伝播して、リトライ処理を有効にする
            throw error;
        }
    }
    
    // 重複検索結果の削除
    removeDuplicateResults(results) {
        const uniqueUrls = new Set();
        return results.filter(result => {
            // 既に同じURLがあれば除外
            if (uniqueUrls.has(result.link)) {
                return false;
            }
            
            uniqueUrls.add(result.link);
            return true;
        });
    }
    
    // 5. レポート作成
    async createReport(topic, requirements) {
        this.state.currentTask = 'createReport';
        
        // 検索結果が少ない場合でも続行するように変更
        if (!this.state.searchResults || this.state.searchResults.length === 0) {
            this.updateStatus({
                message: `検索結果なしで一般的な情報に基づいてレポートを作成します`,
                logMessage: `検索結果がありませんが、一般的な情報でレポート作成を続行します`,
                type: 'warning'
            });
            
            // 検索結果がない場合は空の配列ではなく、ダミーデータを使用
            this.state.searchResults = [{
                title: "一般情報 - " + topic,
                link: "https://example.com/general-knowledge",
                snippet: "検索結果が得られなかったため、トピックに関する一般的な知識を使用してレポートを作成します。",
                displayLink: "一般情報ソース",
                searchTerm: "一般情報"
            }];
        }
        
        // 参考文献のテキスト化
        let sourcesText = '';
        if (this.state.searchResults.length > 0) {
            sourcesText = this.state.searchResults
                .map((source, index) => `${index + 1}. タイトル: ${source.title}\n   URL: ${source.link}\n   概要: ${source.snippet}`)
                .join('\n\n');
        } else {
            sourcesText = "利用可能な参考文献がありません。一般的な知識に基づいてレポートを作成します。";
        }
        
        // レポート作成プロンプトの構築
        const prompt = `
        あなたは学術レポート作成の専門家です。以下の条件に基づいて、引用を適切に含む学術レポートを作成してください。

        【レポートトピック】
        ${topic}
        
        ${requirements.description ? `【詳細説明】\n${requirements.description}\n` : ''}
        ${requirements.academicLevel ? `【学術レベル】\n${requirements.academicLevel}\n` : ''}
        ${requirements.wordCount ? `【文字数目安】\n${requirements.wordCount}字程度\n` : ''}
        
        【参考文献】
        ${sourcesText}

        【レポート作成の注意点】
        1. 抽象的で分かりにくい言い回しは避けること
        2. 断定的な物言いをせず、根拠を示しながら主張すること
        3. 同じような視点を示す定型句の多用は控えめにすること
        4. 同じパターンの書き方をしないこと
        5. 「〜した。〜した」のように語尾を重ねないこと
        6. 参考文献が十分にある場合は、引用箇所を「」で示し、（）で出典を示すこと
           例)〜によると「引用部分」（出典）と述べられている。
        7. 引用する場合は必ず元の文献の内容に忠実に引用すること（存在しない内容や文章を引用しないこと）
        8. 参考文献に含まれていない情報を引用として記載しないこと
        9. 引用元が不明な場合は、「〜と考えられる」などの表現を使い、無理に出典を示さないこと
        ${requirements.wordCount ? `10. 文字数は${requirements.wordCount}字の±20%以内に収めること` : ''}
        ${this.state.searchResults.length === 0 ? `11. 参考文献がないため、一般的な知識や情報に基づいてレポートを作成すること` : ''}

        【レポートの構成】
        - タイトル
        - 序論（研究の背景・目的）
        - 本論（複数のセクションに分けて論じる）
        - 結論（要約と考察）
        - 参考文献リスト
        
        レポート全体を出力してください。
        `;
        
        // Gemini APIの呼び出し
        const response = await this.callGeminiAPI(prompt);
        
        if (!response) {
            throw new Error('レポートの生成に失敗しました');
        }
        
        this.state.reportContent = response;
        return response;
    }
    
    // 6. レポートの検証
    async validateReport(requirements) {
        this.state.currentTask = 'validateReport';
        
        if (!this.state.reportContent) {
            throw new Error('検証するレポート内容がありません');
        }
        
        // 検証プロンプトの構築
        const prompt = `
        あなたは学術レポートの品質評価の専門家です。以下のレポートを厳格に評価し、問題点と改善が必要な箇所を詳細に指摘してください。

        【評価するレポート】
        ${this.state.reportContent}

        【評価基準】
        1. 文字数: ${requirements.wordCount ? `${requirements.wordCount}字の±20%以内か` : '適切か'}
        2. 引用: 適切に引用されているか、引用と自分の意見の区別は明確か
        3. 参考文献: 適切に引用元が示されているか
        4. 論理構造: 序論、本論、結論の構成は明確か
        5. 重複・冗長性: 同じ表現や文章構造の繰り返しはないか
        6. 文章スタイル: 学術的な文体が一貫しているか
        7. 全体的な品質: 理解しやすく、説得力のある内容か

        【回答形式】
        1. 総合評価（0〜100点）
        2. 検出された問題点（カテゴリ別に重要度高/中/低で分類）
        3. 改善が必要かどうかの判断（「改善必要」または「合格」）
        4. 改善すべき具体的な箇所と提案

        評価結果のみを出力してください。レポート本文は繰り返さないでください。
        `;
        
        // Gemini APIの呼び出し
        const response = await this.callGeminiAPI(prompt);
        
        if (!response) {
            throw new Error('レポートの検証に失敗しました');
        }
        
        // 検証結果の解析
        const validationResults = this.parseValidationResults(response);
        this.state.validationResults = validationResults;
        
        return validationResults;
    }
    
    // 検証結果の解析
    parseValidationResults(text) {
        // 総合評価のスコア抽出
        const scoreMatch = text.match(/総合評価.*?(\d+)点/);
        const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
        
        // 改善の必要性を判断
        const needsImprovement = text.includes('改善必要') || score < 70;
        
        // 問題点の抽出
        const issues = [];
        const issueRegex = /問題点.*?([高中低]).*?[：:]\s*(.+?)(?=\n|$)/g;
        let match;
        
        while ((match = issueRegex.exec(text)) !== null) {
            const severity = match[1]; // 高、中、低
            const description = match[2].trim();
            
            // 問題のタイプを判定
            let type = 'general';
            if (description.includes('文字数') || description.includes('長さ')) {
                type = 'word-count';
            } else if (description.includes('引用') || description.includes('参考文献')) {
                type = 'citation';
            } else if (description.includes('繰り返し') || description.includes('重複') || description.includes('冗長')) {
                type = 'repetition';
            } else if (description.includes('構成') || description.includes('構造') || description.includes('流れ')) {
                type = 'structure';
            }
            
            issues.push({
                severity,
                description,
                type,
                title: this.getIssueTitleByType(type)
            });
        }
        
        return {
            score,
            needsImprovement,
            issues,
            rawText: text
        };
    }
    
    // 問題タイプに基づくタイトル取得
    getIssueTitleByType(type) {
        switch (type) {
            case 'word-count':
                return '文字数の問題';
            case 'citation':
                return '引用・参照の問題';
            case 'repetition':
                return '表現の重複';
            case 'structure':
                return '構成の問題';
            default:
                return '品質の問題';
        }
    }
    
    // 7. レポートの改善
    async improveReport() {
        this.state.currentTask = 'improveReport';
        
        if (!this.state.reportContent) {
            throw new Error('改善するレポート内容がありません');
        }
        
        if (!this.state.validationResults) {
            throw new Error('検証結果がありません');
        }
        
        // 改善プロンプトの構築
        const prompt = `
        あなたは学術レポートの改善専門家です。以下のレポートを、検証結果に基づいて改善してください。

        【元のレポート】
        ${this.state.reportContent}

        【検証結果】
        ${this.state.validationResults.rawText}

        【改善指示】
        1. 指摘された問題点を全て修正してください
        2. レポートの構成や論理展開を保ちながら改善してください
        3. 引用の適切性を確認し、必要に応じて修正してください
        4. 文体や表現の一貫性を維持してください
        5. 明らかな事実誤認や論理的矛盾を解消してください

        改善したレポート全体を出力してください。修正箇所に関する説明は不要です。
        `;
        
        // Gemini APIの呼び出し
        const response = await this.callGeminiAPI(prompt);
        
        if (!response) {
            throw new Error('レポートの改善に失敗しました');
        }
        
        this.state.finalReport = response;
        
        // 改善完了通知
        this.updateStatus({
            message: 'レポートの改善が完了しました',
            logMessage: '検証結果に基づくレポートの改善が完了しました',
            type: 'success'
        });
        
        return response;
    }
    
    // Gemini APIの呼び出し
    async callGeminiAPI(prompt) {
        if (!this.geminiApiKey) {
            throw new Error('Gemini APIキーが設定されていません');
        }
        
        try {
            // タイムアウト対策
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Gemini APIリクエストがタイムアウトしました')), 30000)
            );
            
            // リトライ処理を追加
            let retryCount = 0;
            let maxRetries = 2;
            let lastError = null;
            
            while (retryCount <= maxRetries) {
                try {
                    const fetchPromise = fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-goog-api-key': this.geminiApiKey
                        },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{
                                    text: prompt
                                }]
                            }],
                            generationConfig: {
                                temperature: this.config.temperature,
                                topK: 40,
                                topP: 0.95,
                                maxOutputTokens: 8192,
                            }
                        })
                    });
                    
                    const response = await Promise.race([fetchPromise, timeoutPromise]);
                    
                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('Gemini API エラーレスポンス:', errorText);
                        
                        if (response.status === 429) {
                            throw new Error('Gemini APIのレート制限に達しました。少し待ってから再試行します。');
                        } else if (response.status === 403) {
                            throw new Error('Gemini APIキーが無効か、アクセス権限がありません。');
                        } else {
                            throw new Error(`Gemini APIエラー: ${response.status}`);
                        }
                    }
                    
                    const data = await response.json();
                    
                    // エラーチェック
                    if (data.error) {
                        console.error('Gemini API error:', data.error);
                        throw new Error(`Gemini APIエラー: ${data.error.message || '不明なエラー'}`);
                    }
                    
                    // レスポンスから生成されたテキストを抽出
                    if (data.candidates && data.candidates[0] && data.candidates[0].content &&
                        data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
                        return data.candidates[0].content.parts[0].text;
                    }
                    
                    throw new Error('Gemini APIからの応答が不正な形式です');
                } catch (error) {
                    lastError = error;
                    console.error(`Gemini API呼び出し失敗 (試行 ${retryCount + 1}/${maxRetries + 1}):`, error);
                    
                    retryCount++;
                    
                    if (retryCount <= maxRetries) {
                        // 指数バックオフでリトライ間隔を増やす
                        const waitTime = Math.min(1000 * Math.pow(2, retryCount - 1), 8000);
                        this.updateStatus({
                            logMessage: `Gemini API呼び出しを再試行します (${retryCount}/${maxRetries})... ${waitTime}ms待機`,
                            type: 'warning'
                        });
                        
                        await new Promise(resolve => setTimeout(resolve, waitTime));
                    } else {
                        throw lastError;
                    }
                }
            }
            
            throw new Error('Gemini APIの呼び出しに失敗しました');
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            
            // UIに表示するエラーメッセージを改善
            this.updateStatus({
                logMessage: `Gemini API呼び出しエラー: ${error.message}`,
                type: 'error'
            });
            
            // APIエラーの場合は一般的な情報でのレポート生成を試みる
            if (this.state.currentTask === 'createReport') {
                this.updateStatus({
                    logMessage: 'APIエラーのため、簡易的なレポート生成を試みます',
                    type: 'warning'
                });
                
                // 非常にシンプルなレポートテンプレート
                return `
# ${this.state.searchTerms ? this.state.searchTerms[0] : '指定されたトピック'}に関するレポート

## はじめに
このレポートは、API接続の問題により制限された情報を基に作成されました。

## 概要
このトピックに関する一般的な情報を基にレポートを作成します。

## 結論
さらに詳細な情報を得るためには、インターネット接続やAPIの状態が改善された後に再試行することをお勧めします。

## 参考文献
- 一般情報ソース
                `;
            }
            
            return null;
        }
    }
    
    // ステータス更新
    updateStatus(update) {
        if (typeof this.statusCallback === 'function') {
            this.statusCallback(update);
        }
        
        if (update.logMessage) {
            console.log(`[GeminiReportSystem] ${update.logMessage}`);
        }
    }
}

// グローバルスコープでエクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeminiReportSystem;
} else if (typeof window !== 'undefined') {
    window.GeminiReportSystem = GeminiReportSystem;
} 