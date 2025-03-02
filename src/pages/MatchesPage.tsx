import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Avatar,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Close as CloseIcon,
  Star as StarIcon,
  Refresh as RefreshIcon,
  ArrowBack as ArrowBackIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import TinderCard from 'react-tinder-card';
import { motion, AnimatePresence } from 'framer-motion';

// プロフィールの型定義
interface Profile {
  id: number;
  name: string;
  age: number;
  distance: number;
  bio: string;
  profession: string;
  images: string[];
  interests: string[];
  lastActive: string;
}

// アニメーション設定
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const MatchesPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // プロフィールデータ
  const profiles: Profile[] = [
    {
      id: 1,
      name: '田中さくら',
      age: 26,
      distance: 3,
      bio: '旅行と写真が好きです。新しい場所を探検するのが趣味で、週末はよくカフェ巡りをしています。一緒にお出かけできる人を探しています！',
      profession: 'グラフィックデザイナー',
      images: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
      ],
      interests: ['写真', '旅行', 'カフェ', '映画鑑賞'],
      lastActive: '10分前'
    },
    {
      id: 2,
      name: '佐藤あやか',
      age: 24,
      distance: 5,
      bio: 'フィットネスインストラクターをしています。健康的な生活が大好きで、よく朝ランニングをしています。旅行も好きで、最近は国内旅行に興味があります。',
      profession: 'フィットネスインストラクター',
      images: [
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
        'https://images.unsplash.com/photo-1528975604071-b102845ab8ff?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
        'https://images.unsplash.com/photo-1526080652727-5b77f74eacd2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80'
      ],
      interests: ['フィットネス', '料理', '国内旅行', 'ヨガ'],
      lastActive: '30分前'
    },
    {
      id: 3,
      name: '鈴木みれい',
      age: 27,
      distance: 2,
      bio: '音楽教師をしています。ピアノとバイオリンが弾けます。クラシック音楽が好きですが、最近はJ-POPにも興味があります。カフェでゆっくり過ごす時間が好きです。',
      profession: '音楽教師',
      images: [
        'https://images.unsplash.com/photo-1496440737103-cd596325d314?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
        'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=686&q=80',
        'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
      ],
      interests: ['音楽', 'ピアノ', 'カフェ', '読書'],
      lastActive: '1時間前'
    },
    {
      id: 4,
      name: '山田はるか',
      age: 25,
      distance: 7,
      bio: 'マーケティング会社で働いています。新しいトレンドや文化に興味があります。休日は友達とショッピングやブランチを楽しんでいます。',
      profession: 'マーケティングマネージャー',
      images: [
        'https://images.unsplash.com/photo-1464863979621-258859e62245?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=686&q=80',
        'https://images.unsplash.com/photo-1485199692108-c3b5069de6a0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
        'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1176&q=80'
      ],
      interests: ['マーケティング', 'ファッション', '社交', 'グルメ'],
      lastActive: '昨日'
    },
    {
      id: 5,
      name: '中村ゆき',
      age: 28,
      distance: 4,
      bio: 'フリーランスのライターをしています。言葉を使って人の心を動かすことが好きです。コーヒーとチョコレートの組み合わせが大好きで、カフェめぐりが趣味です。',
      profession: 'フリーランスライター',
      images: [
        'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
        'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
      ],
      interests: ['ライティング', 'カフェ', '読書', '映画鑑賞'],
      lastActive: '3時間前'
    }
  ];

  // ステート
  const [currentIndex, setCurrentIndex] = useState<number>(profiles.length - 1);
  const [lastDirection, setLastDirection] = useState<string>('');
  const [showMatchDialog, setShowMatchDialog] = useState<boolean>(false);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [outOfProfiles, setOutOfProfiles] = useState<boolean>(false);
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('info');

  // カレントのプロフィールを取得
  const currentProfile = profiles[currentIndex];

  // TinderCardの参照
  const childRefs = useMemo<React.RefObject<any>[]>(
    () =>
      Array(profiles.length)
        .fill(0)
        .map(() => React.createRef()),
    [profiles.length]
  );

  // スワイプアクション
  const swipe = async (dir: string) => {
    // プロフィールがない場合は処理を行わない
    if (currentIndex < 0) {
      setOutOfProfiles(true);
      return;
    }
    
    setLoading(true);
    await childRefs[currentIndex].current.swipe(dir);
    setLoading(false);
  };

  // スワイプの方向を処理
  const swiped = (direction: string, profileIndex: number) => {
    setLastDirection(direction);

    // スワイプした方向によって処理を分岐
    if (direction === 'right') {
      // いいね（右スワイプ）の場合
      const matchOdds = Math.random();
      if (matchOdds > 0.7) {
        // 30%の確率でマッチング成功
        setMatchedProfile(profiles[profileIndex]);
        setShowMatchDialog(true);
      } else {
        // マッチングしなかった場合はスナックバーを表示
        setSnackbarMessage('いいねを送りました！');
        setSnackbarSeverity('success');
        setShowSnackbar(true);
      }
    } else if (direction === 'left') {
      // スキップ（左スワイプ）の場合
      setSnackbarMessage('次の候補に進みます');
      setSnackbarSeverity('info');
      setShowSnackbar(true);
    } else if (direction === 'up') {
      // スーパーライク（上スワイプ）の場合
      setSnackbarMessage('スーパーいいねを送りました！');
      setSnackbarSeverity('success');
      setShowSnackbar(true);
    }
  };

  // カードが画面から去った後の処理
  const outOfFrame = (profileIndex: number) => {
    // プロフィールのインデックスを更新
    if (currentIndex === profileIndex) {
      setCurrentIndex(currentIndex - 1);
      setCurrentImageIndex(0);
    }
  };

  // プロフィール画像を切り替え
  const handleImageChange = (direction: 'next' | 'prev') => {
    if (!currentProfile) return;

    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % currentProfile.images.length);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + currentProfile.images.length) % currentProfile.images.length);
    }
  };

  // 詳細表示を切り替え
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // マッチダイアログを閉じる
  const handleCloseMatchDialog = () => {
    setShowMatchDialog(false);
    setMatchedProfile(null);
  };

  // プロフィールをリセット
  const handleReset = () => {
    setCurrentIndex(profiles.length - 1);
    setOutOfProfiles(false);
    setCurrentImageIndex(0);
  };

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        height: 'calc(100vh - 120px)', 
        display: 'flex', 
        flexDirection: 'column',
        py: 2
      }}
    >
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
          マッチング
        </Typography>
        
        {outOfProfiles && (
          <Button
            variant="outlined"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={handleReset}
          >
            リセット
          </Button>
        )}
      </Box>

      <Box 
        sx={{ 
          flexGrow: 1, 
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* プロフィールカードコンテナ */}
        {profiles.length > 0 && !outOfProfiles ? (
          <Box 
            sx={{ 
              position: 'relative',
              width: '100%',
              maxWidth: 400,
              height: 500,
              margin: '0 auto'
            }}
          >
            {profiles.map((profile, index) => (
              <Box
                key={profile.id}
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  display: index === currentIndex ? 'block' : 'none'
                }}
              >
                <TinderCard
                  ref={childRefs[index]}
                  className="swipe"
                  onSwipe={(dir) => swiped(dir, index)}
                  onCardLeftScreen={() => outOfFrame(index)}
                  preventSwipe={['down']}
                  swipeRequirementType="position"
                  swipeThreshold={80}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 4,
                      overflow: 'hidden',
                      position: 'relative',
                      backgroundImage: `url(${profile.images[currentImageIndex]})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      cursor: 'grab',
                      '&:active': {
                        cursor: 'grabbing'
                      }
                    }}
                  >
                    {/* 画像切り替えのナビゲーション */}
                    <Box
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageChange('prev');
                      }}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '30%',
                        height: '70%',
                        zIndex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        padding: 1,
                        opacity: 0,
                        '&:hover': {
                          opacity: 0.6
                        }
                      }}
                    >
                      <ArrowBackIcon sx={{ color: 'white', fontSize: 30 }} />
                    </Box>

                    <Box
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageChange('next');
                      }}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '30%',
                        height: '70%',
                        zIndex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        padding: 1,
                        opacity: 0,
                        '&:hover': {
                          opacity: 0.6
                        }
                      }}
                    >
                      <ArrowBackIcon sx={{ color: 'white', fontSize: 30, transform: 'rotate(180deg)' }} />
                    </Box>

                    {/* イメージインジケーター */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 0,
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 0.5,
                        zIndex: 1
                      }}
                    >
                      {profile.images.map((_, imgIndex) => (
                        <Box
                          key={imgIndex}
                          sx={{
                            width: 40,
                            height: 4,
                            backgroundColor: imgIndex === currentImageIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                            borderRadius: 4
                          }}
                        />
                      ))}
                    </Box>

                    {/* プロフィール情報のオーバーレイ */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: 2,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.6) 50%, transparent 100%)',
                        color: 'white',
                        transition: 'all 0.3s ease',
                        transform: showDetails ? 'translateY(-30%)' : 'translateY(0)',
                        height: showDetails ? '70%' : 'auto',
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                          {profile.name}, {profile.age}
                        </Typography>
                        <IconButton
                          size="small"
                          sx={{ color: 'white' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDetails();
                          }}
                        >
                          <InfoIcon />
                        </IconButton>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1" sx={{ mr: 2 }}>
                          {profile.profession}
                        </Typography>
                        <Typography variant="body2" color="rgba(255,255,255,0.7)">
                          {profile.distance}km先
                        </Typography>
                      </Box>

                      <AnimatePresence>
                        {showDetails && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <Typography variant="body1" sx={{ mb: 2 }}>
                              {profile.bio}
                            </Typography>

                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                              興味・趣味
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                              {profile.interests.map((interest, idx) => (
                                <Chip 
                                  key={idx} 
                                  label={interest} 
                                  size="small" 
                                  sx={{ 
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    color: 'white'
                                  }} 
                                />
                              ))}
                            </Box>

                            <Typography variant="body2" color="rgba(255,255,255,0.7)">
                              最終ログイン: {profile.lastActive}
                            </Typography>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Box>
                  </Paper>
                </TinderCard>
              </Box>
            ))}
          </Box>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ width: '100%', textAlign: 'center' }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  backgroundColor: theme.palette.background.paper,
                  maxWidth: 500,
                  margin: '0 auto'
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  今日のおすすめユーザーはいません
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  また後でチェックしてください。新しいユーザーを見つけるために、プロフィールを更新して検索範囲を広げることもできます。
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<RefreshIcon />}
                  onClick={handleReset}
                >
                  プロフィールをリセット
                </Button>
              </Paper>
            </motion.div>
          </AnimatePresence>
        )}

        {/* アクションボタン */}
        {!outOfProfiles && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              mt: 4,
              mb: 2
            }}
          >
            <IconButton
              color="error"
              disabled={loading || currentIndex < 0}
              onClick={() => swipe('left')}
              sx={{
                backgroundColor: 'white',
                boxShadow: theme.shadows[2],
                p: 2
              }}
            >
              <CloseIcon fontSize="large" />
            </IconButton>

            <IconButton
              color="primary"
              disabled={loading || currentIndex < 0}
              onClick={() => swipe('up')}
              sx={{
                backgroundColor: 'white',
                boxShadow: theme.shadows[2],
                p: 1.5
              }}
            >
              <StarIcon fontSize="medium" />
            </IconButton>

            <IconButton
              color="success"
              disabled={loading || currentIndex < 0}
              onClick={() => swipe('right')}
              sx={{
                backgroundColor: 'white',
                boxShadow: theme.shadows[2],
                p: 2
              }}
            >
              <FavoriteIcon fontSize="large" />
            </IconButton>
          </Box>
        )}

        {/* ローディングインジケーター */}
        {loading && (
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
            <CircularProgress />
          </Box>
        )}
      </Box>

      {/* マッチダイアログ */}
      <Dialog
        open={showMatchDialog}
        onClose={handleCloseMatchDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', bgcolor: theme.palette.primary.main, color: 'white', py: 2 }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
            マッチング成功！
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <Box sx={{ position: 'relative', width: 180, height: 180, margin: '0 auto', mb: 2 }}>
            <Avatar
              src={matchedProfile?.images[0]}
              alt={matchedProfile?.name}
              sx={{
                width: 120,
                height: 120,
                position: 'absolute',
                top: 0,
                left: 0,
                border: `4px solid ${theme.palette.primary.main}`,
              }}
            />
            <Avatar
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Your profile"
              sx={{
                width: 120,
                height: 120,
                position: 'absolute',
                bottom: 0,
                right: 0,
                border: `4px solid ${theme.palette.secondary.main}`,
              }}
            />
          </Box>
          <Typography variant="h6" gutterBottom>
            あなたと{matchedProfile?.name}さんがマッチングしました！
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            今すぐメッセージを送って会話を始めましょう！
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            variant="outlined" 
            onClick={handleCloseMatchDialog}
          >
            後で
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleCloseMatchDialog}
          >
            メッセージを送る
          </Button>
        </DialogActions>
      </Dialog>

      {/* スナックバー通知 */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSnackbar(false)} 
          severity={snackbarSeverity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MatchesPage; 