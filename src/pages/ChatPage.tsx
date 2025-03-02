import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  TextField,
  Button,
  IconButton,
  Divider,
  CircularProgress,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  MoreVert as MoreVertIcon,
  AttachFile as AttachFileIcon,
  Image as ImageIcon,
  InsertEmoticon as EmojiIcon,
  Phone as PhoneIcon,
  Videocam as VideoIcon,
  Block as BlockIcon,
  Delete as DeleteIcon,
  Report as ReportIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { GeminiContext } from '../context/GeminiContext';

// メッセージの型定義
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
  isAI?: boolean;
}

// プロフィールデータの型定義
interface Profile {
  id: string;
  name: string;
  age: number;
  avatar: string;
  bio: string;
  lastActive: string;
  interests: string[];
}

const ChatPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage, isLoading } = useContext(GeminiContext);
  
  // ステート
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'info'>('info');
  
  // メニュー開閉状態
  const isMenuOpen = Boolean(menuAnchorEl);
  
  // メニューを開く
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };
  
  // メニューを閉じる
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  // サンプルプロフィールデータ
  useEffect(() => {
    // 本来はAPIでデータを取得するが、ここではモックデータを使用
    const mockProfiles: Record<string, Profile> = {
      '1': {
        id: '1',
        name: '佐藤さくら',
        age: 24,
        avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
        bio: 'こんにちは！東京在住のさくらです。趣味は料理と旅行です。よろしくお願いします！',
        lastActive: '3分前',
        interests: ['料理', '旅行', '映画', '音楽']
      },
      '2': {
        id: '2',
        name: '田中みき',
        age: 26,
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        bio: 'フリーランスのデザイナーをしています。休日は美術館巡りが好きです。',
        lastActive: '1時間前',
        interests: ['アート', 'デザイン', 'カフェ巡り', '読書']
      },
      '3': {
        id: '3',
        name: '山本あおい',
        age: 22,
        avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
        bio: '大学4年生です。ダンスサークルに所属しています。よろしくお願いします。',
        lastActive: '30分前',
        interests: ['ダンス', 'ファッション', 'アニメ', 'カラオケ']
      }
    };
    
    // URLパラメータからプロフィールデータを設定
    if (id && mockProfiles[id]) {
      setProfile(mockProfiles[id]);
      
      // サンプルメッセージの設定
      const initialMessages: Message[] = [
        {
          id: '1',
          text: 'こんにちは！',
          sender: 'ai',
          timestamp: new Date(Date.now() - 86400000),
          status: 'read',
          isAI: true
        },
        {
          id: '2',
          text: 'はじめまして！よろしくお願いします。',
          sender: 'user',
          timestamp: new Date(Date.now() - 82800000),
          status: 'read'
        },
        {
          id: '3',
          text: 'プロフィール見ました！共通の趣味がありそうですね。',
          sender: 'user',
          timestamp: new Date(Date.now() - 79200000),
          status: 'read'
        },
        {
          id: '4',
          text: 'そうですね！どんな映画が好きですか？',
          sender: 'ai',
          timestamp: new Date(Date.now() - 75600000),
          status: 'read',
          isAI: true
        },
        {
          id: '5',
          text: '最近だとアクション映画をよく見ています。あなたは？',
          sender: 'user',
          timestamp: new Date(Date.now() - 72000000),
          status: 'read'
        }
      ];
      setMessages(initialMessages);
    } else {
      // IDが不正な場合はメッセージ一覧ページにリダイレクト
      navigate('/messages');
    }
  }, [id, navigate]);
  
  // 新しいメッセージが追加されたら自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // メッセージ送信処理
  const handleSendMessage = async () => {
    if (!input.trim() || !profile) return;
    
    // ユーザーメッセージをメッセージリストに追加
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    
    try {
      // Gemini APIを使用して応答を生成
      const response = await sendMessage(input, profile.name, messages);
      
      // AIの応答をメッセージリストに追加
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response || `すみません、${profile.name}は今応答できません。`,
        sender: 'ai',
        timestamp: new Date(),
        isAI: true
      };
      
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setAlertMessage('メッセージの送信中にエラーが発生しました');
      setAlertSeverity('error');
      setShowAlert(true);
    }
  };
  
  // キー入力のハンドラ（Enterキーでメッセージ送信）
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // 入力変更のハンドラ
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  
  // 通話機能（デモ用）
  const handleCall = () => {
    setAlertMessage('通話機能は開発中です');
    setAlertSeverity('info');
    setShowAlert(true);
    handleMenuClose();
  };
  
  // ビデオ通話機能（デモ用）
  const handleVideoCall = () => {
    setAlertMessage('ビデオ通話機能は開発中です');
    setAlertSeverity('info');
    setShowAlert(true);
    handleMenuClose();
  };
  
  // ブロック機能（デモ用）
  const handleBlock = () => {
    setAlertMessage(`${profile?.name}をブロックしました`);
    setAlertSeverity('success');
    setShowAlert(true);
    handleMenuClose();
    
    // 少し待ってからメッセージ一覧に戻る
    setTimeout(() => {
      navigate('/messages');
    }, 1500);
  };
  
  // 報告機能（デモ用）
  const handleReport = () => {
    setAlertMessage('報告を受け付けました。ご協力ありがとうございます。');
    setAlertSeverity('success');
    setShowAlert(true);
    handleMenuClose();
  };
  
  // 削除機能（デモ用）
  const handleDelete = () => {
    setAlertMessage('会話を削除しました');
    setAlertSeverity('success');
    setShowAlert(true);
    handleMenuClose();
    
    // 少し待ってからメッセージ一覧に戻る
    setTimeout(() => {
      navigate('/messages');
    }, 1500);
  };
  
  // タイムスタンプのフォーマット
  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // 今日の場合は時間を表示
      return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      // 昨日の場合
      return '昨日';
    } else if (diffDays < 7) {
      // 1週間以内の場合は曜日を表示
      const days = ['日', '月', '火', '水', '木', '金', '土'];
      return days[date.getDay()] + '曜日';
    } else {
      // それ以外は日付を表示
      return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
    }
  };
  
  // プロフィール情報がない場合はローディング表示
  if (!profile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container 
      disableGutters 
      maxWidth={false} 
      sx={{ 
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: 'background.default'
      }}
    >
      {/* チャットヘッダー */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar sx={{ px: 1 }}>
          <IconButton 
            edge="start" 
            color="inherit" 
            onClick={() => navigate('/messages')}
          >
            <ArrowBackIcon />
          </IconButton>
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flex: 1,
              cursor: 'pointer' 
            }}
            onClick={() => setShowInfo(!showInfo)}
          >
            <Avatar 
              src={profile.avatar} 
              alt={profile.name} 
              sx={{ width: 40, height: 40, mr: 1.5 }}
            />
            <Box>
              <Typography variant="subtitle1" component="div" sx={{ fontWeight: 500 }}>
                {profile.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {profile.lastActive}
              </Typography>
            </Box>
          </Box>
          
          <Box>
            <IconButton color="inherit" onClick={handleCall}>
              <PhoneIcon />
            </IconButton>
            <IconButton color="inherit" onClick={handleVideoCall}>
              <VideoIcon />
            </IconButton>
            <IconButton 
              color="inherit"
              onClick={handleMenuOpen}
              aria-controls="chat-menu"
              aria-haspopup="true"
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* プロフィール情報（トグル可能） */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Paper sx={{ p: 2, borderRadius: 0 }}>
              <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar 
                    src={profile.avatar} 
                    alt={profile.name} 
                    sx={{ width: 80, height: 80, mb: 1 }}
                  />
                  <Typography variant="h6" component="div" sx={{ fontWeight: 500 }}>
                    {profile.name}, {profile.age}
                  </Typography>
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" paragraph>
                    {profile.bio}
                  </Typography>
                  
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    興味・趣味
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {profile.interests.map((interest, index) => (
                      <Chip 
                        key={index} 
                        label={interest} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* メッセージ表示エリア */}
      <Box 
        sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100'
        }}
      >
        {messages.map((message, index) => (
          <Box 
            key={message.id}
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-end', maxWidth: '80%' }}>
              {message.sender === 'ai' && (
                <Avatar 
                  src={profile.avatar} 
                  alt={profile.name} 
                  sx={{ width: 32, height: 32, mr: 1, mb: 1 }}
                />
              )}
              
              <Paper 
                sx={{ 
                  p: 1.5, 
                  borderRadius: 2,
                  borderBottomLeftRadius: message.sender === 'ai' ? 0 : 2,
                  borderBottomRightRadius: message.sender === 'user' ? 0 : 2,
                  bgcolor: message.sender === 'user' 
                    ? theme.palette.primary.main 
                    : theme.palette.background.paper,
                  color: message.sender === 'user' 
                    ? theme.palette.primary.contrastText 
                    : theme.palette.text.primary,
                  maxWidth: '100%',
                  wordBreak: 'break-word'
                }}
              >
                <Typography variant="body1">
                  {message.text}
                </Typography>
              </Paper>
            </Box>
            
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mt: 0.5,
                mb: 1,
                ml: message.sender === 'ai' ? 5 : 0,
                mr: message.sender === 'user' ? 0 : 0,
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                {formatTimestamp(message.timestamp)}
              </Typography>
            </Box>
          </Box>
        ))}
        
        {/* AI応答のローディング表示 */}
        {isLoading && (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              alignSelf: 'flex-start',
              mt: 1
            }}
          >
            <Avatar 
              src={profile.avatar} 
              alt={profile.name} 
              sx={{ width: 32, height: 32, mr: 1 }}
            />
            <Paper 
              sx={{ 
                p: 1.5, 
                borderRadius: 2,
                borderBottomLeftRadius: 0,
                bgcolor: theme.palette.background.paper,
                minWidth: 60
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant="body2" component="div" sx={{ mr: 1 }}>
                  <span style={{ marginRight: 4 }}>•</span>
                  <span style={{ marginRight: 4 }}>•</span>
                  <span>•</span>
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}
        
        {/* 自動スクロール用の参照ポイント */}
        <div ref={messagesEndRef} />
      </Box>
      
      {/* 入力エリア */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 1, 
          display: 'flex', 
          alignItems: 'center',
          borderTop: `1px solid ${theme.palette.divider}`
        }}
      >
        <IconButton color="primary" size="large" sx={{ mr: 1 }}>
          <EmojiIcon />
        </IconButton>
        <IconButton color="primary" size="large" sx={{ mr: 1 }}>
          <AttachFileIcon />
        </IconButton>
        <TextField
          fullWidth
          placeholder="メッセージを入力..."
          variant="outlined"
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          multiline
          maxRows={4}
          sx={{ 
            '& .MuiOutlinedInput-root': {
              borderRadius: 10,
            }
          }}
        />
        <IconButton 
          color="primary" 
          size="large" 
          onClick={handleSendMessage}
          disabled={!input.trim() || isLoading}
          sx={{ ml: 1 }}
        >
          <SendIcon />
        </IconButton>
      </Paper>
      
      {/* メニュー */}
      <Menu
        id="chat-menu"
        anchorEl={menuAnchorEl}
        keepMounted
        open={isMenuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 2,
          sx: { minWidth: 180 }
        }}
      >
        <MenuItem onClick={handleVideoCall}>
          <ListItemIcon>
            <VideoIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="ビデオ通話" />
        </MenuItem>
        <MenuItem onClick={handleCall}>
          <ListItemIcon>
            <PhoneIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="音声通話" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { setShowInfo(!showInfo); handleMenuClose(); }}>
          <ListItemIcon>
            <InfoIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="プロフィール情報" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleBlock} sx={{ color: theme.palette.error.main }}>
          <ListItemIcon>
            <BlockIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="ブロック" />
        </MenuItem>
        <MenuItem onClick={handleReport} sx={{ color: theme.palette.warning.main }}>
          <ListItemIcon>
            <ReportIcon fontSize="small" color="warning" />
          </ListItemIcon>
          <ListItemText primary="報告する" />
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: theme.palette.error.main }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="会話を削除" />
        </MenuItem>
      </Menu>
      
      {/* 通知スナックバー */}
      <Snackbar
        open={showAlert}
        autoHideDuration={4000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowAlert(false)} 
          severity={alertSeverity}
          variant="filled"
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ChatPage; 