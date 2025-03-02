import React, { createContext, useState, useEffect, ReactNode } from 'react';

// ユーザータイプの定義
interface User {
  email: string;
  name?: string;
  profileImage?: string;
}

// 認証コンテキストの型定義
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: { email: string }) => void;
  logout: () => void;
}

// デフォルト値の作成
const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {}
};

// コンテキストの作成
export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// プロバイダーコンポーネントの型定義
interface AuthProviderProps {
  children: ReactNode;
}

// プロバイダーコンポーネント
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // 認証状態の管理
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // ローカルストレージからユーザー情報を取得
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Failed to parse stored user data:', e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // ログイン処理
  const login = (userData: { email: string }) => {
    // ユーザープロフィール画像の生成（ダミー画像URL）
    const randomProfileImage = `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`;
    
    // ユーザー名の生成（メールアドレスの@前の部分）
    const name = userData.email.split('@')[0];
    
    // ユーザー情報の設定
    const user: User = {
      email: userData.email,
      name,
      profileImage: randomProfileImage
    };
    
    // ステートとローカルストレージの更新
    setUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(user));
  };

  // ログアウト処理
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 