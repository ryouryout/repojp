import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  Divider,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
  Card,
  CardMedia,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CalendarMonth as CalendarIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Group as GroupIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  AccessTime as AccessTimeIcon,
  PriceCheck as PriceIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

// イベントデータの型定義
interface EventData {
  id: string;
  title: string;
  description: string;
  images: string[];
  date: string;
  time: string;
  location: string;
  participants: Participant[];
  maxParticipants: number;
  price: number;
  category: string;
  tags: string[];
  organizer: Organizer;
  isFavorite: boolean;
}

// 参加者の型定義
interface Participant {
  id: string;
  name: string;
  avatar: string;
}

// 主催者の型定義
interface Organizer {
  id: string;
  name: string;
  avatar: string;
  description: string;
  eventsCount: number;
}

// アニメーション設定
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useContext(AuthContext);
  
  // ステート
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [dialogStep, setDialogStep] = useState<number>(1);
  const [numParticipants, setNumParticipants] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [activeImage, setActiveImage] = useState<number>(0);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'info'>('success');
  
  // モックイベントデータの取得
  useEffect(() => {
    // 本来はAPIでデータを取得するが、ここではモックデータを使用
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // モックデータ
        const mockEvent: EventData = {
          id: '1',
          title: '春の桜ピクニック＆お花見パーティー',
          description: `美しい桜の下で新しい出会いを見つけませんか？\n\n満開の桜の下でピクニックとお花見パーティーを開催します。美味しい食事と飲み物を提供し、楽しいゲームも用意しています。春の陽気の中、素敵な出会いを探しましょう。\n\n【持ち物】\n・レジャーシート（あれば）\n・飲み物（アルコールも可）\n・好きなおつまみ（シェアできるものだと嬉しいです）\n\n【注意事項】\n・天候により中止の場合は前日までにご連絡します\n・ゴミは各自お持ち帰りください`,
          images: [
            'https://images.unsplash.com/photo-1522383225653-ed111181a951?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1551088373-ecfa00934e1e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1521127474489-d524412fd439?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80'
          ],
          date: '2023年4月2日（日）',
          time: '12:00 - 17:00',
          location: '東京都新宿区 新宿御苑',
          participants: [
            { id: '1', name: '田中さくら', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
            { id: '2', name: '山田太郎', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
            { id: '3', name: '伊藤花子', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
            { id: '4', name: '佐藤健', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
            { id: '5', name: '高橋美咲', avatar: 'https://randomuser.me/api/portraits/women/22.jpg' },
            { id: '6', name: '渡辺拓海', avatar: 'https://randomuser.me/api/portraits/men/67.jpg' },
            { id: '7', name: '鈴木ひかり', avatar: 'https://randomuser.me/api/portraits/women/17.jpg' }
          ],
          maxParticipants: 20,
          price: 3000,
          category: 'アウトドア',
          tags: ['お花見', 'ピクニック', '春', '出会い', '東京'],
          organizer: {
            id: '1',
            name: 'トキメキイベント',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
            description: 'トキメキイベントは、関東を中心に様々な出会いのイベントを開催しています。素敵な出会いを通じて、新しい恋愛や友情を見つけるお手伝いをしています。',
            eventsCount: 24
          },
          isFavorite: false
        };
        
        // 1秒後にデータを設定して、ローディング効果を示す
        setTimeout(() => {
          setEvent(mockEvent);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching event data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  // お気に入り登録・解除
  const handleToggleFavorite = () => {
    if (event) {
      setEvent({
        ...event,
        isFavorite: !event.isFavorite
      });
      
      setAlertMessage(event.isFavorite ? 'お気に入りから削除しました' : 'お気に入りに追加しました');
      setAlertSeverity('success');
      setShowAlert(true);
    }
  };
  
  // 共有機能
  const handleShare = () => {
    // コピー機能はWeb API Navigatorに依存
    if (navigator.clipboard && event) {
      navigator.clipboard.writeText(`「${event.title}」のイベント情報はこちら: https://lovematch.example.com/events/${event.id}`)
        .then(() => {
          setAlertMessage('イベントのリンクをコピーしました');
          setAlertSeverity('success');
          setShowAlert(true);
        })
        .catch(() => {
          setAlertMessage('リンクのコピーに失敗しました');
          setAlertSeverity('error');
          setShowAlert(true);
        });
    } else {
      setAlertMessage('お使いのブラウザでは共有機能がサポートされていません');
      setAlertSeverity('error');
      setShowAlert(true);
    }
  };
  
  // 申し込みダイアログを開く
  const handleOpenDialog = () => {
    setOpenDialog(true);
    setDialogStep(1);
    setNumParticipants(1);
    setNotes('');
  };
  
  // 申し込みダイアログを閉じる
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  // 次のステップへ進む
  const handleNextStep = () => {
    setDialogStep(2);
  };
  
  // 前のステップに戻る
  const handlePrevStep = () => {
    setDialogStep(1);
  };
  
  // 参加者数変更
  const handleParticipantsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 5) {
      setNumParticipants(value);
    }
  };
  
  // メモ変更
  const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(e.target.value);
  };
  
  // 申し込み送信
  const handleSubmit = () => {
    setSubmitting(true);
    
    // 実際のAPIコールの代わりに、タイマーを使用してモック
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      
      // 成功メッセージを表示して3秒後にダイアログを閉じる
      setTimeout(() => {
        setOpenDialog(false);
        setSuccess(false);
        
        // イベント参加者に自分を追加
        if (event && user) {
          const newParticipant: Participant = {
            id: Date.now().toString(),
            name: user.name || '匿名ユーザー',
            avatar: user.profileImage || 'https://randomuser.me/api/portraits/lego/1.jpg'
          };
          
          setEvent({
            ...event,
            participants: [...event.participants, newParticipant]
          });
          
          setAlertMessage('イベントへの参加申し込みが完了しました');
          setAlertSeverity('success');
          setShowAlert(true);
        }
      }, 3000);
    }, 2000);
  };
  
  // 参加済みかどうかを確認
  const isAlreadyJoined = () => {
    if (!event || !user) return false;
    return event.participants.some(p => p.name === user.name);
  };
  
  // メイン画像を変更
  const handleImageChange = (index: number) => {
    setActiveImage(index);
  };
  
  // ローディング中の表示
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // イベントデータがない場合の表示
  if (!event) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            イベントが見つかりません
          </Typography>
          <Typography variant="body1" paragraph>
            指定されたイベントは存在しないか、削除された可能性があります。
          </Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/events')}>
            イベント一覧に戻る
          </Button>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.5 }}
      >
        {/* 戻るボタンとタイトル */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <IconButton 
            color="inherit" 
            sx={{ mr: 1 }}
            onClick={() => navigate('/events')}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            イベント詳細
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {/* 左側: イベント画像とギャラリー */}
          <Grid item xs={12} md={7}>
            <Card sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}>
              <CardMedia
                component="img"
                height={400}
                image={event.images[activeImage]}
                alt={event.title}
                sx={{ objectFit: 'cover' }}
              />
            </Card>
            
            {/* 画像サムネイルギャラリー */}
            <Grid container spacing={1} sx={{ mb: 3 }}>
              {event.images.map((image, index) => (
                <Grid item xs={4} key={index}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      border: index === activeImage ? `2px solid ${theme.palette.primary.main}` : 'none',
                      borderRadius: 1,
                      height: 100,
                      overflow: 'hidden'
                    }}
                    onClick={() => handleImageChange(index)}
                  >
                    <CardMedia
                      component="img"
                      height="100%"
                      image={image}
                      alt={`${event.title} - イメージ ${index + 1}`}
                      sx={{ objectFit: 'cover' }}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {/* イベントタイトルと説明（モバイル表示時のみ） */}
            {isMobile && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 1 }}>
                  {event.title}
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {event.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>
                
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
                  {event.description}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    color={event.isFavorite ? 'secondary' : 'primary'}
                    startIcon={event.isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    onClick={handleToggleFavorite}
                    sx={{ flex: 1 }}
                  >
                    {event.isFavorite ? 'お気に入り済み' : 'お気に入り'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<ShareIcon />}
                    onClick={handleShare}
                    sx={{ flex: 1 }}
                  >
                    共有
                  </Button>
                </Box>
              </Box>
            )}
            
            {/* イベント詳細情報 */}
            <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                イベント詳細
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarIcon color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        開催日
                      </Typography>
                      <Typography variant="body1">
                        {event.date}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ScheduleIcon color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        時間
                      </Typography>
                      <Typography variant="body1">
                        {event.time}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationIcon color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        場所
                      </Typography>
                      <Typography variant="body1">
                        {event.location}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <GroupIcon color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        参加状況
                      </Typography>
                      <Typography variant="body1">
                        {event.participants.length} / {event.maxParticipants}人
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PriceIcon color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        参加費
                      </Typography>
                      <Typography variant="body1">
                        {event.price.toLocaleString()}円
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CategoryIcon color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        カテゴリー
                      </Typography>
                      <Typography variant="body1">
                        {event.category}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
            
            {/* 参加者一覧 */}
            <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                参加者 ({event.participants.length}人)
              </Typography>
              
              <Grid container spacing={1}>
                {event.participants.map((participant) => (
                  <Grid item xs={4} sm={3} md={2} key={participant.id}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Avatar
                        src={participant.avatar}
                        alt={participant.name}
                        sx={{ width: 50, height: 50, mb: 1 }}
                      />
                      <Typography variant="body2" sx={{ textAlign: 'center', fontSize: '0.8rem' }}>
                        {participant.name}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
          
          {/* 右側: イベント情報と申し込み */}
          <Grid item xs={12} md={5}>
            {/* イベントタイトルと説明（デスクトップ表示時のみ） */}
            {!isMobile && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 1 }}>
                  {event.title}
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {event.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>
                
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
                  {event.description}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    color={event.isFavorite ? 'secondary' : 'primary'}
                    startIcon={event.isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    onClick={handleToggleFavorite}
                  >
                    {event.isFavorite ? 'お気に入り済み' : 'お気に入り'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<ShareIcon />}
                    onClick={handleShare}
                  >
                    共有
                  </Button>
                </Box>
              </Box>
            )}
            
            {/* 主催者情報 */}
            <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                主催者情報
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={event.organizer.avatar}
                  alt={event.organizer.name}
                  sx={{ width: 60, height: 60, mr: 2 }}
                />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {event.organizer.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    開催イベント: {event.organizer.eventsCount}件
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body2" paragraph>
                {event.organizer.description}
              </Typography>
            </Paper>
            
            {/* 申し込みカード */}
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                border: `1px solid ${theme.palette.primary.main}`,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                イベントに参加する
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTimeIcon color="warning" sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary">
                  募集中 - あと{event.maxParticipants - event.participants.length}人参加できます
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                  参加費用
                </Typography>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 600 }}>
                  {event.price.toLocaleString()}円
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  * 当日現金でのお支払いとなります
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleOpenDialog}
                disabled={isAlreadyJoined()}
                sx={{ 
                  py: 1.5,
                  borderRadius: 2
                }}
              >
                {isAlreadyJoined() ? '参加申込済み' : '参加を申し込む'}
              </Button>
              
              {isAlreadyJoined() && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                  このイベントにはすでに参加申込済みです
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
      
      {/* 参加申し込みダイアログ */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {dialogStep === 1 ? '参加申し込み' : '申し込み内容の確認'}
        </DialogTitle>
        
        <DialogContent>
          {dialogStep === 1 ? (
            // ステップ1: 申し込み情報入力
            <>
              <DialogContentText sx={{ mb: 3 }}>
                イベントの参加人数と特記事項を入力してください
              </DialogContentText>
              
              <TextField
                label="参加人数"
                type="number"
                value={numParticipants}
                onChange={handleParticipantsChange}
                fullWidth
                margin="normal"
                InputProps={{ inputProps: { min: 1, max: 5 } }}
                helperText="1〜5人まで申し込み可能です"
              />
              
              <TextField
                label="特記事項・質問など（任意）"
                multiline
                rows={4}
                value={notes}
                onChange={handleNotesChange}
                fullWidth
                margin="normal"
                placeholder="アレルギーや質問事項があればご記入ください"
              />
            </>
          ) : (
            // ステップ2: 確認
            <>
              <DialogContentText sx={{ mb: 3 }}>
                以下の内容で申し込みを確定します。よろしいですか？
              </DialogContentText>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">イベント</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>{event.title}</Typography>
                
                <Typography variant="subtitle2">日時</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>{event.date} {event.time}</Typography>
                
                <Typography variant="subtitle2">場所</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>{event.location}</Typography>
                
                <Typography variant="subtitle2">参加人数</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>{numParticipants}人</Typography>
                
                <Typography variant="subtitle2">参加費用（合計）</Typography>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 600, color: theme.palette.primary.main }}>
                  {(event.price * numParticipants).toLocaleString()}円
                </Typography>
                
                {notes && (
                  <>
                    <Typography variant="subtitle2">特記事項</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>{notes}</Typography>
                  </>
                )}
              </Box>
              
              <DialogContentText color="warning.main" sx={{ fontSize: '0.9rem' }}>
                * 申し込み後のキャンセルは、イベント3日前までにお願いします。
              </DialogContentText>
            </>
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          {dialogStep === 1 ? (
            <>
              <Button onClick={handleCloseDialog} color="inherit">
                キャンセル
              </Button>
              <Button 
                onClick={handleNextStep} 
                variant="contained" 
                color="primary"
                disabled={numParticipants < 1}
              >
                次へ
              </Button>
            </>
          ) : submitting ? (
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', py: 1 }}>
              <CircularProgress size={30} />
            </Box>
          ) : success ? (
            <Box sx={{ width: '100%', textAlign: 'center', py: 1 }}>
              <Typography color="success.main" sx={{ fontWeight: 500 }}>
                申し込みが完了しました！
              </Typography>
            </Box>
          ) : (
            <>
              <Button onClick={handlePrevStep} color="inherit">
                戻る
              </Button>
              <Button 
                onClick={handleSubmit} 
                variant="contained" 
                color="primary"
              >
                申し込みを確定する
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
      
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

export default EventDetailPage; 