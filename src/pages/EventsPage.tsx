import React, { useState, useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
  Divider,
  InputAdornment,
  Tabs,
  Tab,
  IconButton,
  useMediaQuery
} from '@mui/material';
import {
  Search as SearchIcon,
  DateRange as DateRangeIcon,
  LocationOn as LocationOnIcon,
  Group as GroupIcon,
  FilterList as FilterListIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

// アニメーション設定
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// イベントカテゴリ
const categories = [
  'すべて',
  'パーティー',
  'アウトドア',
  'グルメ',
  'カルチャー',
  'スポーツ',
  'オンライン'
];

// サンプルのイベントデータ
const eventsData = [
  {
    id: 1,
    title: '渋谷スカイラウンジ交流パーティー',
    description: '東京の夜景を一望できる素敵な会場で、軽食とドリンクを楽しみながら交流できるパーティーです。様々な職業の方が参加予定で、新しい出会いのチャンスです。',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    date: '2023年10月15日(土)',
    time: '19:00 - 22:00',
    location: '渋谷スカイラウンジ',
    participants: 45,
    maxParticipants: 60,
    price: '5,000円',
    category: 'パーティー',
    tags: ['飲み放題付き', '軽食付き', '20代・30代向け'],
    isFavorite: false
  },
  {
    id: 2,
    title: '鎌倉ハイキング＆ピクニック',
    description: '鎌倉の自然を満喫するハイキングイベントです。古寺巡りと美しい海岸線を歩いた後は、皆でピクニックを楽しみましょう。初心者大歓迎です。',
    image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    date: '2023年10月22日(日)',
    time: '10:00 - 16:00',
    location: '鎌倉・鶴岡八幡宮前集合',
    participants: 18,
    maxParticipants: 25,
    price: '3,500円',
    category: 'アウトドア',
    tags: ['初心者歓迎', 'ランチ付き', '自然'],
    isFavorite: true
  },
  {
    id: 3,
    title: '恵比寿クラフトビール巡り',
    description: '恵比寿周辺のクラフトビールが楽しめるお店を巡るイベントです。ビール好きな方はもちろん、これからビールに詳しくなりたい方も大歓迎です。',
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1986&q=80',
    date: '2023年10月28日(土)',
    time: '18:00 - 21:00',
    location: 'JR恵比寿駅西口集合',
    participants: 12,
    maxParticipants: 15,
    price: '6,000円',
    category: 'グルメ',
    tags: ['お酒', 'ビール', '食べ歩き'],
    isFavorite: false
  },
  {
    id: 4,
    title: '上野美術館鑑賞ツアー',
    description: '上野の美術館を巡るカルチャーイベントです。現在開催中の特別展を美術に詳しいガイドと一緒に鑑賞します。その後は参加者同士でカフェでの交流会も予定しています。',
    image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
    date: '2023年11月5日(日)',
    time: '13:00 - 17:00',
    location: '上野公園・東京都美術館前集合',
    participants: 8,
    maxParticipants: 20,
    price: '4,500円',
    category: 'カルチャー',
    tags: ['美術', 'ガイド付き', '入場料込み'],
    isFavorite: false
  },
  {
    id: 5,
    title: 'オンライン料理教室',
    description: 'プロの料理人から学ぶオンライン料理教室です。今回のテーマは「簡単イタリアン」。材料リストは事前にお送りします。お家で料理しながら交流を楽しみましょう。',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745adc8b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    date: '2023年11月12日(日)',
    time: '17:00 - 19:00',
    location: 'Zoom（オンライン）',
    participants: 15,
    maxParticipants: 30,
    price: '2,500円',
    category: 'オンライン',
    tags: ['料理', '初心者歓迎', '材料リスト付き'],
    isFavorite: true
  },
  {
    id: 6,
    title: '代々木公園でヨガ＆ピクニック',
    description: '休日の朝に代々木公園で行うヨガイベントです。初心者向けのクラスなので、ヨガ未経験の方も安心して参加できます。ヨガの後は参加者同士でピクニックを楽しみましょう。',
    image: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1970&q=80',
    date: '2023年11月18日(土)',
    time: '10:00 - 13:00',
    location: '代々木公園・原宿門集合',
    participants: 25,
    maxParticipants: 30,
    price: '3,000円',
    category: 'スポーツ',
    tags: ['ヨガマット貸出あり', '初心者向け', '軽食付き'],
    isFavorite: false
  }
];

const EventsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated } = useContext(AuthContext);
  
  // ステート
  const [events, setEvents] = useState(eventsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('すべて');
  const [selectedEvent, setSelectedEvent] = useState<typeof eventsData[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [participantCount, setParticipantCount] = useState(1);
  const [notes, setNotes] = useState('');

  // イベントのフィルタリング
  const filteredEvents = events.filter(event => {
    // カテゴリーフィルター
    if (selectedCategory !== 'すべて' && event.category !== selectedCategory) {
      return false;
    }
    
    // 検索フィルター
    if (searchTerm && !event.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !event.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // カテゴリータブの変更
  const handleCategoryChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedCategory(newValue);
  };

  // お気に入り切り替え
  const handleToggleFavorite = (eventId: number) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId 
          ? { ...event, isFavorite: !event.isFavorite } 
          : event
      )
    );
  };

  // イベント申し込みダイアログを開く
  const handleOpenDialog = (event: typeof eventsData[0]) => {
    if (!isAuthenticated) {
      // 未ログインの場合はログインページへ
      alert('この機能を利用するにはログインが必要です');
      return;
    }
    setSelectedEvent(event);
    setIsDialogOpen(true);
    setParticipantCount(1);
    setNotes('');
  };

  // ダイアログを閉じる
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
  };

  // イベント申し込み処理
  const handleSubmitApplication = () => {
    if (!selectedEvent) return;
    
    setIsSubmitting(true);
    
    // 申し込み処理のシミュレーション
    setTimeout(() => {
      setSuccessMessage(`${selectedEvent.title}への申し込みが完了しました！`);
      setShowSuccess(true);
      setIsSubmitting(false);
      handleCloseDialog();
      
      // 参加者数を更新
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === selectedEvent.id 
            ? { ...event, participants: event.participants + participantCount } 
            : event
        )
      );
    }, 1500);
  };

  // 成功メッセージを閉じる
  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          イベント
        </Typography>
        <Typography variant="body1" color="text.secondary">
          新しい出会いのきっかけとなるイベントに参加しましょう。共通の趣味や興味を持った人と出会うチャンスです。
        </Typography>
      </Box>
      
      {/* 検索バー */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="イベントを検索..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end">
                  <FilterListIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ 
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: theme.shadows[1]
          }}
        />
      </Box>
      
      {/* カテゴリータブ */}
      <Box sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={selectedCategory} 
          onChange={handleCategoryChange}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{ mb: 0 }}
        >
          {categories.map((category) => (
            <Tab 
              key={category} 
              label={category} 
              value={category}
              sx={{ 
                fontWeight: 600,
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                }
              }}
            />
          ))}
        </Tabs>
      </Box>
      
      {/* イベント一覧 */}
      {filteredEvents.length > 0 ? (
        <Grid container spacing={3}>
          {filteredEvents.map((event, index) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: theme.shadows[2],
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[8],
                    }
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={event.image}
                      alt={event.title}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '50%',
                        p: 0.5,
                        zIndex: 1,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(event.id);
                        }}
                        color="primary"
                      >
                        {event.isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      </IconButton>
                    </Box>
                    <Chip
                      label={event.category}
                      color="primary"
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        left: 8,
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                    <Typography 
                      gutterBottom 
                      variant="h6" 
                      component="h2"
                      sx={{ fontWeight: 600, mb: 1, lineHeight: 1.3 }}
                    >
                      {event.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <DateRangeIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {event.date} {event.time}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOnIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {event.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <GroupIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {event.participants}/{event.maxParticipants}人
                      </Typography>
                      <Box 
                        sx={{ 
                          ml: 1, 
                          flexGrow: 1, 
                          height: 6, 
                          bgcolor: 'rgba(0,0,0,0.1)',
                          borderRadius: 5,
                          overflow: 'hidden'
                        }}
                      >
                        <Box 
                          sx={{ 
                            height: '100%', 
                            width: `${(event.participants / event.maxParticipants) * 100}%`,
                            bgcolor: event.participants >= event.maxParticipants 
                              ? 'error.main' 
                              : event.participants / event.maxParticipants > 0.7 
                                ? 'warning.main' 
                                : 'success.main',
                            borderRadius: 5
                          }} 
                        />
                      </Box>
                    </Box>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        mb: 2
                      }}
                    >
                      {event.description}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                      {event.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                  <Divider />
                  <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1.5 }}>
                    <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 600 }}>
                      {event.price}
                    </Typography>
                    <Button 
                      size="small" 
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenDialog(event)}
                      disabled={event.participants >= event.maxParticipants}
                    >
                      {event.participants >= event.maxParticipants ? '満員' : '申し込む'}
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            条件に一致するイベントが見つかりませんでした。
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            検索条件やカテゴリーを変更してみてください。
          </Typography>
        </Box>
      )}
      
      {/* イベント申し込みダイアログ */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedEvent && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                イベント参加申し込み
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  src={selectedEvent.image} 
                  variant="rounded"
                  sx={{ width: 60, height: 60, mr: 2 }}
                />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {selectedEvent.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedEvent.date} {selectedEvent.time}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedEvent.location}
                  </Typography>
                </Box>
              </Box>
              
              <DialogContentText paragraph>
                以下の内容で申し込みを行います。内容をご確認の上、申し込みボタンを押してください。
              </DialogContentText>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  参加人数
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  variant="outlined"
                  value={participantCount}
                  onChange={(e) => setParticipantCount(Math.max(1, Math.min(5, parseInt(e.target.value) || 1)))}
                  inputProps={{ min: 1, max: 5 }}
                  helperText="最大5名まで申し込めます"
                  size="small"
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  メッセージ・質問など（任意）
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="イベント主催者へのメッセージや質問があればご記入ください"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Box>
              
              <Box sx={{ bgcolor: theme.palette.grey[50], p: 2, borderRadius: 1, mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: theme.palette.primary.main }}>
                  お支払い金額
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">
                    イベント参加費（{participantCount}名）
                  </Typography>
                  <Typography variant="body2">
                    {isNaN(parseInt(selectedEvent.price.replace(/[^0-9]/g, ''))) 
                      ? selectedEvent.price 
                      : parseInt(selectedEvent.price.replace(/[^0-9]/g, '')) * participantCount + '円'}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    合計
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                    {isNaN(parseInt(selectedEvent.price.replace(/[^0-9]/g, ''))) 
                      ? selectedEvent.price 
                      : parseInt(selectedEvent.price.replace(/[^0-9]/g, '')) * participantCount + '円'}
                  </Typography>
                </Box>
              </Box>
              
              <DialogContentText variant="body2" color="text.secondary">
                ※お支払いはイベント当日に現地でお願いします。キャンセルは参加日の3日前まで無料で可能です。
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button 
                onClick={handleCloseDialog} 
                color="inherit"
                disabled={isSubmitting}
              >
                キャンセル
              </Button>
              <Button 
                onClick={handleSubmitApplication} 
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                startIcon={isSubmitting && <CircularProgress size={20} color="inherit" />}
              >
                申し込む
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* 成功メッセージ */}
      <Snackbar 
        open={showSuccess} 
        autoHideDuration={6000} 
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSuccess} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EventsPage; 