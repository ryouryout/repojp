import React, { createContext, useState, useContext, type ReactNode } from 'react';
// import axios from 'axios';

// APIキー
// const API_KEY = 'AIzaSyD8jqgFnk9r9gUavkiNL8qqHIMu9eejhhs';

// メッセージの型定義
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// 会話の型定義
interface Conversation {
  id: string;
  messages: Message[];
  partnerName: string;
  partnerAvatar: string;
  lastMessageTime: Date;
  systemPrompt: string;
}

// Geminiコンテキストの型定義
interface GeminiContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  setCurrentConversation: (id: string) => void;
  sendMessage: (text: string) => Promise<void>;
  startNewConversation: (partnerName: string, partnerAvatar: string, systemPrompt: string) => string;
}

// コンテキストの作成
export const GeminiContext = createContext<GeminiContextType | undefined>(undefined);

// Geminiプロバイダーコンポーネント
const GeminiProvider = ({ children }: { children: ReactNode }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversationState] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 新しい会話を開始する
  const startNewConversation = (partnerName: string, partnerAvatar: string, systemPrompt: string): string => {
    const newConversationId = `conv_${Date.now()}`;
    const newConversation: Conversation = {
      id: newConversationId,
      messages: [],
      partnerName,
      partnerAvatar,
      lastMessageTime: new Date(),
      systemPrompt,
    };

    setConversations((prev: Conversation[]) => [...prev, newConversation]);
    return newConversationId;
  };

  // 現在の会話を設定する
  const setCurrentConversation = (id: string) => {
    const conversation = conversations.find((conv: Conversation) => conv.id === id);
    if (conversation) {
      setCurrentConversationState(conversation);
    }
  };

  // メッセージを送信する
  const sendMessage = async (text: string): Promise<void> => {
    if (!currentConversation) return;

    // ユーザーのメッセージを追加
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date()
    };

    // 会話を更新
    const updatedConversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, userMessage],
      lastMessageTime: new Date()
    };

    // ローディング状態を設定
    setIsLoading(true);

    // 状態を更新
    setCurrentConversationState(updatedConversation);
    setConversations((prev: Conversation[]) => 
      prev.map((conv: Conversation) => conv.id === updatedConversation.id ? updatedConversation : conv)
    );

    try {
      // Gemini APIを呼び出す
      // ここでは擬似的な応答を生成します（実際にはAPIを呼び出す）
      // const response = await axios.post(
      //   `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      //   {
      //     contents: [
      //       {
      //         role: "user",
      //         parts: [{ text: updatedConversation.systemPrompt }]
      //       },
      //       ...updatedConversation.messages.map(msg => ({
      //         role: msg.sender === 'user' ? "user" : "model",
      //         parts: [{ text: msg.text }]
      //       }))
      //     ]
      //   }
      // );

      // 擬似的な応答を生成（実際はAPIレスポンスを使用）
      // API実装が完了したら、上記のコメントアウトを解除してこちらをコメントアウトしてください
      await new Promise(resolve => setTimeout(resolve, 1000)); // 応答の遅延をシミュレート
      
      // AIの応答を生成
      const aiResponse = generateAIResponse(text, currentConversation.partnerName);
      
      // AIの応答メッセージを作成
      const aiMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      // 会話を再度更新
      const finalConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, aiMessage],
        lastMessageTime: new Date()
      };

      // 状態を更新
      setCurrentConversationState(finalConversation);
      setConversations((prev: Conversation[]) => 
        prev.map((conv: Conversation) => conv.id === finalConversation.id ? finalConversation : conv)
      );
    } catch (error) {
      console.error('Error sending message to Gemini API:', error);
      // エラー処理を行う
    } finally {
      setIsLoading(false);
    }
  };

  // 擬似的なAI応答を生成する関数
  const generateAIResponse = (userMessage: string, partnerName: string): string => {
    const greeting = ["こんにちは", "おはよう", "やあ", "ハロー"].some(g => 
      userMessage.toLowerCase().includes(g.toLowerCase())
    );

    const question = userMessage.includes("?") || userMessage.includes("？");
    
    const aboutSelf = ["あなた", "君", "きみ", "自己紹介"].some(term => 
      userMessage.toLowerCase().includes(term.toLowerCase())
    );
    
    if (greeting) {
      return `こんにちは！${partnerName}です。今日はどんな一日でしたか？`;
    } else if (aboutSelf) {
      return `私は${partnerName}です。趣味は読書と映画鑑賞です。あなたについてもっと教えてください！`;
    } else if (question) {
      return `いい質問ですね！考えさせてください...${userMessage.replace("?", "").replace("？", "")}については、個人的には素敵なことだと思います。あなたはどう思いますか？`;
    } else {
      const responses = [
        `なるほど、それは興味深いですね！もっと詳しく教えてもらえますか？`,
        `そうなんですね！私もそう思います。他には何か共通の趣味はありますか？`,
        `それは素敵ですね！私も似たような経験があります。一緒にお話できて嬉しいです。`,
        `面白いですね！あなたともっとお話したいです。週末は何か予定ありますか？`,
        `そうなんですね。私はそれについて違う見方をしていました。あなたの意見を聞けて嬉しいです！`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };

  const contextValue: GeminiContextType = {
    conversations,
    currentConversation,
    isLoading,
    setCurrentConversation,
    sendMessage,
    startNewConversation
  };

  return (
    <GeminiContext.Provider value={contextValue}>
      {children}
    </GeminiContext.Provider>
  );
};

// カスタムフック
export const useGemini = (): GeminiContextType => {
  const context = useContext(GeminiContext);
  if (context === undefined) {
    throw new Error('useGemini must be used within a GeminiProvider');
  }
  return context;
};

export default GeminiProvider; 