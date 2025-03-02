import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  IconButton,
  CircularProgress,
  Badge,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Send as SendIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material';
import { GeminiContext } from '../context/GeminiContext';
import { AuthContext } from '../context/AuthContext';

// サンプルの女の子データ
const girls = [
  {
    id: 1,
    name: '佐藤あかり',
    age: 25,
    profession: 'モデル',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    lastMessage: 'こんにちは！マッチングありがとう！',
    lastMessageTime: '14:30',
    unread: 1,
    personality: 'フレンドリー',
    interests: ['旅行', '写真', 'カフェ巡り'],
    bio: '東京在住のモデルです。休日はカフェ巡りや写真撮影が好きです。よろしくお願いします！'
  },
  {
    id: 2,
    name: '山田はるか',
    age: 23,
    profession: 'デザイナー',
    avatar: 'https://randomuser.me/api/portraits/women/67.jpg',
    lastMessage: '今度の週末空いてる？',
    lastMessageTime: '昨日',
    unread: 0,
    personality: '落ち着いた',
    interests: ['アート', '読書', '映画鑑賞'],
    bio: 'グラフィックデザイナーとして働いています。アートや映画が好きで、週末は美術館に行くことが多いです。'
  },
  {
    id: 3,
    name: '鈴木ゆみ',
    age: 27,
    profession: 'マーケター',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    lastMessage: 'おすすめの映画あったら教えてほしいな',
    lastMessageTime: '昨日',
    unread: 2,
    personality: '知的',
    interests: ['ヨガ', '料理', 'ワイン'],
    bio: 'マーケティング企業で働いています。健康的な生活を心がけていて、休日はヨガをしたり自炊を楽しんでいます。'
  },
  {
    id: 4,
    name: '高橋みほ',
    age: 24,
    profession: '看護師',
    avatar: 'https://randomuser.me/api/portraits/women/74.jpg',
    lastMessage: '仕事忙しかった〜疲れた(;´Д`)',
    lastMessageTime: '3日前',
    unread: 0,
    personality: '優しい',
    interests: ['音楽', 'カラオケ', 'ショッピング'],
    bio: '看護師として大学病院で働いています。人を助けることが好きです。休日はショッピングやカラオケでストレス発散してます！'
  },
  {
    id: 5,
    name: '井上ちか',
    age: 26,
    profession: 'エンジニア',
    avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
    lastMessage: 'プログラミング勉強中なんだ〜',
    lastMessageTime: '1週間前',
    unread: 0,
    personality: '論理的',
    interests: ['テクノロジー', 'ゲーム', 'コーヒー'],
    bio: 'IT企業でエンジニアとして働いています。新しい技術を学ぶのが好きで、最近はAIに興味があります。コーヒー好きです。'
  }
];

// チャットメッセージの型
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// 会話履歴の型
interface Conversation {
  id: number;
  messages: Message[];
}

const MessagesPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useContext(AuthContext);
  const { sendMessage, isLoading } = useContext(GeminiContext);
  
  // ステート
  const [selectedGirl, setSelectedGirl] = useState(girls[0]);
  const [input, setInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showChatList, setShowChatList] = useState(!isMobile);
  const [conversations, setConversations] = useState<Record<number, Message[]>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 検索結果の女の子リスト
  const filteredGirls = girls.filter(girl => 
    girl.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 初回ロード時に会話データを初期化
  useEffect(() => {
    // ローカルストレージから会話履歴を取得
    const storedConversations = localStorage.getItem('conversations');
    if (storedConversations) {
      try {
        setConversations(JSON.parse(storedConversations));
      } catch (e) {
        console.error('Failed to parse stored conversations:', e);
        initializeConversations();
      }
    } else {
      initializeConversations();
    }
  }, []);

  // 会話データの初期化
  const initializeConversations = () => {
    const initialConversations: Record<number, Message[]> = {};
    
    girls.forEach(girl => {
      initialConversations[girl.id] = [
        {
          id: `${girl.id}-1`,
          content: `こんにちは！${user?.name || 'あなた'}さん、マッチングありがとうございます。${girl.name}です、${girl.age}歳の${girl.profession}をしています。${girl.bio}`,
          sender: 'ai',
          timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5分前
        }
      ];
    });
    
    setConversations(initialConversations);
    localStorage.setItem('conversations', JSON.stringify(initialConversations));
  };

  // 会話の取得
  const getCurrentConversation = () => {
    return conversations[selectedGirl.id] || [];
  };

  // メッセージ送信
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // ユーザーメッセージの追加
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    // 現在の会話を取得して更新
    const currentConversation = [...getCurrentConversation(), userMessage];
    const updatedConversations = {
      ...conversations,
      [selectedGirl.id]: currentConversation
    };
    
    setConversations(updatedConversations);
    localStorage.setItem('conversations', JSON.stringify(updatedConversations));
    setInput('');
    
    // Gemini APIを使って応答を生成
    try {
      const prompt = `あなたは${selectedGirl.name}という${selectedGirl.age}歳の${selectedGirl.profession}の女性です。性格は${selectedGirl.personality}で、${selectedGirl.interests.join('、')}に興味があります。以下は${user?.name || 'ユーザー'}とのマッチングアプリでのチャットです。${user?.name || 'ユーザー'}のメッセージ: "${input}"

返信のルール:
1. ${selectedGirl.name}として応答してください。一人称は「私」を使用。
2. フレンドリーで自然な短い返事を書いてください（400字以内）。
3. 自然な感情表現や絵文字を適度に使ってください。
4. あくまでも恋愛マッチングアプリの会話として、相手に興味を持った様子を表現してください。
5. 会話を続けやすいように、質問を含めると良いでしょう。
6. 相手の話題に対して共感や関心を示してください。`;

      const aiResponse = await sendMessage(prompt);
      
      // AIメッセージの追加
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: aiResponse || '申し訳ありません、メッセージを送信できませんでした。',
        sender: 'ai',
        timestamp: new Date()
      };
      
      const updatedWithAiResponse = [
        ...updatedConversations[selectedGirl.id],
        aiMessage
      ];
      
      const finalConversations = {
        ...updatedConversations,
        [selectedGirl.id]: updatedWithAiResponse
      };
      
      setConversations(finalConversations);
      localStorage.setItem('conversations', JSON.stringify(finalConversations));
    } catch (error) {
      console.error('Failed to get AI response:', error);
    }
  };

  // チャット相手の選択
  const handleSelectGirl = (girl: typeof girls[0]) => {
    setSelectedGirl(girl);
    if (isMobile) {
      setShowChatList(false);
    }
  };

  // スクロールを一番下に移動
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations]);

  // チャットリストの表示切り替え（モバイルのみ）
  const toggleChatList = () => {
    setShowChatList(!showChatList);
  };

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        height: 'calc(100vh - 120px)', 
        display: 'flex', 
        flexDirection: 'column',
        py: 2
      }}
    >
      <Typography 
        variant="h5" 
        component="h1" 
        sx={{ 
          mb: 2, 
          fontWeight: 600,
          display: { xs: 'flex', md: 'block' },
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        メッセージ
        {isMobile && (
          <Button 
            variant="outlined"
            onClick={toggleChatList}
            size="small"
          >
            {showChatList ? 'チャットを表示' : 'リストを表示'}
          </Button>
        )}
      </Typography>
      
      <Grid 
        container 
        spacing={2} 
        sx={{ 
          flexGrow: 1,
          height: 'calc(100vh - 180px)'
        }}
      >
        {/* チャットリスト */}
        {(showChatList || !isMobile) && (
          <Grid 
            item 
            xs={12} 
            md={4} 
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Paper 
              sx={{ 
                p: 2, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  placeholder="検索..."
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                  }}
                />
              </Box>
              
              <List sx={{ flexGrow: 1, overflow: 'auto' }}>
                {filteredGirls.map((girl) => (
                  <React.Fragment key={girl.id}>
                    <ListItem 
                      button 
                      alignItems="flex-start"
                      selected={selectedGirl.id === girl.id}
                      onClick={() => handleSelectGirl(girl)}
                      sx={{
                        borderRadius: 1,
                        mb: 1,
                        '&.Mui-selected': {
                          backgroundColor: theme.palette.primary.light + '20',
                          '&:hover': {
                            backgroundColor: theme.palette.primary.light + '30',
                          },
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Badge
                          color="error"
                          badgeContent={girl.unread}
                          invisible={girl.unread === 0}
                        >
                          <Avatar 
                            alt={girl.name} 
                            src={girl.avatar}
                            sx={{ width: 50, height: 50 }}
                          />
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1" component="span" sx={{ fontWeight: 600 }}>
                              {girl.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {girl.lastMessageTime}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <React.Fragment>
                            <Typography
                              variant="body2"
                              component="span"
                              sx={{
                                display: 'inline',
                                color: girl.unread > 0 ? 'text.primary' : 'text.secondary',
                                fontWeight: girl.unread > 0 ? 500 : 400,
                              }}
                            >
                              {girl.lastMessage}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        )}
        
        {/* チャット部分 */}
        {(!showChatList || !isMobile) && (
          <Grid 
            item 
            xs={12} 
            md={8} 
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Paper 
              sx={{ 
                p: 0, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              {/* チャットヘッダー */}
              <Box 
                sx={{ 
                  p: 2, 
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {isMobile && (
                    <IconButton 
                      edge="start" 
                      color="inherit" 
                      onClick={toggleChatList}
                      sx={{ mr: 1 }}
                    >
                      <SearchIcon />
                    </IconButton>
                  )}
                  <Avatar 
                    alt={selectedGirl.name} 
                    src={selectedGirl.avatar}
                    sx={{ width: 40, height: 40, mr: 1.5 }}
                  />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {selectedGirl.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedGirl.age}歳・{selectedGirl.profession}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <IconButton color="primary">
                    <FavoriteBorderIcon />
                  </IconButton>
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </Box>
              
              {/* メッセージ一覧 */}
              <Box 
                sx={{ 
                  p: 2, 
                  flexGrow: 1,
                  overflow: 'auto',
                  backgroundColor: theme.palette.background.default + '80',
                  backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              >
                {getCurrentConversation().map((message, index) => (
                  <Box
                    key={message.id}
                    sx={{
                      display: 'flex',
                      justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                      mb: 2,
                    }}
                  >
                    {message.sender === 'ai' && (
                      <Avatar 
                        alt={selectedGirl.name} 
                        src={selectedGirl.avatar}
                        sx={{ 
                          width: 36, 
                          height: 36, 
                          mr: 1,
                          alignSelf: 'flex-end'
                        }}
                      />
                    )}
                    <Box
                      sx={{
                        maxWidth: '75%',
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: message.sender === 'user' 
                          ? theme.palette.primary.main 
                          : theme.palette.background.paper,
                        color: message.sender === 'user' ? 'white' : 'inherit',
                        boxShadow: theme.shadows[1],
                      }}
                    >
                      <Typography variant="body1">
                        {message.content}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          display: 'block', 
                          mt: 1,
                          textAlign: message.sender === 'user' ? 'right' : 'left',
                          opacity: 0.7
                        }}
                      >
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>
                    {message.sender === 'user' && (
                      <Avatar 
                        alt={user?.name || 'User'} 
                        src={user?.profileImage}
                        sx={{ 
                          width: 36, 
                          height: 36, 
                          ml: 1,
                          alignSelf: 'flex-end'
                        }}
                      />
                    )}
                  </Box>
                ))}
                <div ref={messagesEndRef} />
                
                {/* ローディングインジケーター */}
                {isLoading && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <CircularProgress size={30} />
                  </Box>
                )}
              </Box>
              
              {/* 入力フォーム */}
              <Box 
                sx={{ 
                  p: 2, 
                  borderTop: `1px solid ${theme.palette.divider}`,
                  backgroundColor: theme.palette.background.paper
                }}
              >
                <Grid container spacing={1}>
                  <Grid item xs>
                    <TextField
                      fullWidth
                      placeholder="メッセージを入力..."
                      variant="outlined"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      disabled={isLoading}
                      multiline
                      maxRows={3}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<SendIcon />}
                      onClick={handleSendMessage}
                      disabled={!input.trim() || isLoading}
                      sx={{ 
                        height: '100%',
                        px: 3
                      }}
                    >
                      送信
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default MessagesPage; 