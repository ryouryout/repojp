import React, { useState, useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Button,
  Grid,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Edit as EditIcon,
  Notifications as NotificationsIcon,
  Lock as LockIcon,
  Help as HelpIcon,
  Info as InfoIcon,
  Language as LanguageIcon,
  LocationOn as LocationOnIcon,
  PhotoCamera as PhotoCameraIcon,
  InsertPhoto as InsertPhotoIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  ChevronRight as ChevronRightIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

// アニメーション設定
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const ProfilePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useContext(AuthContext);
  
  // ステート
  const [editMode, setEditMode] = useState<boolean>(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState<boolean>(false);
  const [showPhotoDialog, setShowPhotoDialog] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'info'>('success');
  
  // フォームデータ
  const [formData, setFormData] = useState({
    name: user?.name || '匿名ユーザー',
    age: '28',
    location: '東京都',
    bio: 'はじめまして！新しい出会いを探しています。趣味は映画鑑賞と料理です。よろしくお願いします。',
    job: 'エンジニア',
    education: '東京大学',
    interests: ['映画', '料理', '旅行', '読書', 'テクノロジー']
  });
  
  // 設定データ
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: false,
    darkMode: false,
    locationSharing: true,
    privateProfile: false,
    language: '日本語'
  });
  
  // 写真ギャラリー
  const photos = [
    user?.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
  ];
  
  // 統計データ
  const stats = {
    matches: 15,
    likes: 42,
    views: 128,
    events: 3
  };
  
  // フォームデータの更新
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // 設定の更新
  const handleSettingChange = (setting: string) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting as keyof typeof settings]
    });
  };
  
  // プロフィール保存
  const handleSaveProfile = () => {
    setEditMode(false);
    setAlertMessage('プロフィールを保存しました');
    setAlertSeverity('success');
    setShowAlert(true);
  };
  
  // ログアウト処理
  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.5 }}
      >
        <Paper 
          elevation={2} 
          sx={{ 
            p: 0, 
            borderRadius: 2, 
            overflow: 'hidden' 
          }}
        >
          {/* カバー画像とプロフィールヘッダー */}
          <Box
            sx={{
              height: 200,
              width: '100%',
              position: 'relative',
              backgroundColor: theme.palette.primary.light,
              backgroundImage: 'linear-gradient(45deg, #ff4b91, #ff9a8d)',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                bottom: -64,
                left: { xs: '50%', md: 32 },
                transform: { xs: 'translateX(-50%)', md: 'none' },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Avatar
                src={user?.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg'}
                alt={formData.name}
                sx={{ 
                  width: 128, 
                  height: 128, 
                  border: '4px solid white',
                  boxShadow: theme.shadows[3]
                }}
              />
              {!editMode && (
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  onClick={() => setShowPhotoDialog(true)}
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    },
                  }}
                >
                  <PhotoCameraIcon />
                </IconButton>
              )}
            </Box>
            
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                display: 'flex',
                gap: 1
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowSettingsDialog(true)}
                startIcon={<SettingsIcon />}
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: theme.palette.primary.main
                }}
              >
                設定
              </Button>
              
              <Button
                variant="contained"
                color={editMode ? 'primary' : 'secondary'}
                onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                startIcon={editMode ? null : <EditIcon />}
                sx={{ 
                  backgroundColor: editMode ? 'white' : 'rgba(255, 255, 255, 0.9)',
                  color: editMode ? theme.palette.primary.main : theme.palette.secondary.main
                }}
              >
                {editMode ? '保存' : '編集'}
              </Button>
            </Box>
          </Box>
          
          {/* プロフィール情報 */}
          <Box sx={{ pt: 8, px: 3, pb: 3 }}>
            <Grid container spacing={3}>
              {/* 左側：プロフィール情報 */}
              <Grid item xs={12} md={8}>
                <Box sx={{ textAlign: { xs: 'center', md: 'left' }, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                      {editMode ? (
                        <TextField
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          variant="standard"
                          sx={{ fontSize: '2rem' }}
                        />
                      ) : (
                        formData.name
                      )}
                    </Typography>
                    <VerifiedIcon color="primary" sx={{ ml: 1 }} />
                  </Box>
                  
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mt: 1, 
                      justifyContent: { xs: 'center', md: 'flex-start' } 
                    }}
                  >
                    <LocationOnIcon color="action" fontSize="small" sx={{ mr: 0.5 }} />
                    {editMode ? (
                      <TextField
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        variant="standard"
                        size="small"
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {formData.location}
                      </Typography>
                    )}
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    自己紹介
                  </Typography>
                  {editMode ? (
                    <TextField
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      multiline
                      rows={4}
                      fullWidth
                      variant="outlined"
                    />
                  ) : (
                    <Typography variant="body1">
                      {formData.bio}
                    </Typography>
                  )}
                </Box>
                
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      職業
                    </Typography>
                    {editMode ? (
                      <TextField
                        name="job"
                        value={formData.job}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        size="small"
                      />
                    ) : (
                      <Typography variant="body2">
                        {formData.job}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      学歴
                    </Typography>
                    {editMode ? (
                      <TextField
                        name="education"
                        value={formData.education}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        size="small"
                      />
                    ) : (
                      <Typography variant="body2">
                        {formData.education}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    興味・趣味
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.interests.map((interest, index) => (
                      <Chip 
                        key={index} 
                        label={interest} 
                        color="primary" 
                        variant="outlined" 
                        onDelete={editMode ? () => {
                          setFormData({
                            ...formData,
                            interests: formData.interests.filter((_, i) => i !== index)
                          });
                        } : undefined}
                      />
                    ))}
                    {editMode && (
                      <Chip 
                        label="+ 追加" 
                        variant="outlined" 
                        onClick={() => {
                          const newInterest = prompt('新しい興味・趣味を入力してください');
                          if (newInterest && !formData.interests.includes(newInterest)) {
                            setFormData({
                              ...formData,
                              interests: [...formData.interests, newInterest]
                            });
                          }
                        }} 
                      />
                    )}
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    写真
                  </Typography>
                  <Grid container spacing={1}>
                    {photos.map((photo, index) => (
                      <Grid item xs={4} key={index}>
                        <Paper
                          elevation={1}
                          sx={{
                            borderRadius: 2,
                            overflow: 'hidden',
                            height: 120,
                            backgroundImage: `url(${photo})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'relative'
                          }}
                        >
                          {editMode && (
                            <IconButton
                              color="primary"
                              sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                '&:hover': {
                                  backgroundColor: 'white',
                                },
                                fontSize: 'small',
                                padding: '4px'
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Paper>
                      </Grid>
                    ))}
                    {editMode && (
                      <Grid item xs={4}>
                        <Paper
                          elevation={1}
                          sx={{
                            borderRadius: 2,
                            height: 120,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.08)',
                            }
                          }}
                          onClick={() => setShowPhotoDialog(true)}
                        >
                          <InsertPhotoIcon color="action" sx={{ fontSize: 40, opacity: 0.6 }} />
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Grid>
              
              {/* 右側：ステータス情報 */}
              <Grid item xs={12} md={4}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    mb: 3, 
                    borderRadius: 2 
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    マッチングステータス
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        マッチング数
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                        {stats.matches}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        いいね数
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.secondary.main }}>
                        {stats.likes}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        プロフィール閲覧数
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {stats.views}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        参加イベント数
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {stats.events}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
                
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2 
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    アカウント
                  </Typography>
                  <List disablePadding>
                    <ListItem 
                      button
                      sx={{ px: 1, borderRadius: 1 }}
                      onClick={() => setShowSettingsDialog(true)}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <SettingsIcon color="action" />
                      </ListItemIcon>
                      <ListItemText primary="アカウント設定" />
                      <ChevronRightIcon color="action" />
                    </ListItem>
                    <ListItem 
                      button
                      sx={{ px: 1, borderRadius: 1 }}
                      onClick={() => {
                        setAlertMessage('プライバシー設定ページは開発中です');
                        setAlertSeverity('info');
                        setShowAlert(true);
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <LockIcon color="action" />
                      </ListItemIcon>
                      <ListItemText primary="プライバシー設定" />
                      <ChevronRightIcon color="action" />
                    </ListItem>
                    <ListItem 
                      button
                      sx={{ px: 1, borderRadius: 1 }}
                      onClick={() => {
                        setAlertMessage('ヘルプページは開発中です');
                        setAlertSeverity('info');
                        setShowAlert(true);
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <HelpIcon color="action" />
                      </ListItemIcon>
                      <ListItemText primary="ヘルプ & サポート" />
                      <ChevronRightIcon color="action" />
                    </ListItem>
                    <ListItem 
                      button
                      sx={{ px: 1, borderRadius: 1 }}
                      onClick={() => {
                        setAlertMessage('利用規約ページは開発中です');
                        setAlertSeverity('info');
                        setShowAlert(true);
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <InfoIcon color="action" />
                      </ListItemIcon>
                      <ListItemText primary="利用規約 & プライバシーポリシー" />
                      <ChevronRightIcon color="action" />
                    </ListItem>
                    <ListItem 
                      button
                      sx={{ 
                        px: 1, 
                        borderRadius: 1,
                        color: theme.palette.error.main
                      }}
                      onClick={() => setShowLogoutConfirm(true)}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <LogoutIcon color="error" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="ログアウト" 
                        primaryTypographyProps={{ color: 'error' }}
                      />
                      <ChevronRightIcon color="error" />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </motion.div>
      
      {/* 設定ダイアログ */}
      <Dialog
        open={showSettingsDialog}
        onClose={() => setShowSettingsDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" component="div">
            アカウント設定
          </Typography>
        </DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText 
                primary="プッシュ通知" 
                secondary="アプリからの通知を受け取る" 
              />
              <Switch
                edge="end"
                checked={settings.notifications}
                onChange={() => handleSettingChange('notifications')}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText 
                primary="メール通知" 
                secondary="メールでの通知を受け取る" 
              />
              <Switch
                edge="end"
                checked={settings.emailNotifications}
                onChange={() => handleSettingChange('emailNotifications')}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LockIcon />
              </ListItemIcon>
              <ListItemText 
                primary="プライベートプロフィール" 
                secondary="プロフィールを非公開にする" 
              />
              <Switch
                edge="end"
                checked={settings.privateProfile}
                onChange={() => handleSettingChange('privateProfile')}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LocationOnIcon />
              </ListItemIcon>
              <ListItemText 
                primary="位置情報の共有" 
                secondary="現在地を他のユーザーに表示する" 
              />
              <Switch
                edge="end"
                checked={settings.locationSharing}
                onChange={() => handleSettingChange('locationSharing')}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LanguageIcon />
              </ListItemIcon>
              <ListItemText 
                primary="言語設定" 
                secondary={settings.language} 
              />
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => {
                  setSettings({
                    ...settings,
                    language: settings.language === '日本語' ? 'English' : '日本語'
                  });
                }}
              >
                変更
              </Button>
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettingsDialog(false)}>
            キャンセル
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {
              setShowSettingsDialog(false);
              setAlertMessage('設定を保存しました');
              setAlertSeverity('success');
              setShowAlert(true);
            }}
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 写真アップロードダイアログ */}
      <Dialog
        open={showPhotoDialog}
        onClose={() => setShowPhotoDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" component="div">
            プロフィール写真
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Avatar
              src={user?.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg'}
              alt={formData.name}
              sx={{ 
                width: 150, 
                height: 150, 
                margin: '0 auto',
                mb: 2
              }}
            />
            <Button
              variant="outlined"
              component="label"
              startIcon={<PhotoCameraIcon />}
            >
              写真を選択
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={() => {
                  setShowPhotoDialog(false);
                  setAlertMessage('写真のアップロード機能は開発中です');
                  setAlertSeverity('info');
                  setShowAlert(true);
                }}
              />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPhotoDialog(false)}>
            キャンセル
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {
              setShowPhotoDialog(false);
              setAlertMessage('写真を更新しました');
              setAlertSeverity('success');
              setShowAlert(true);
            }}
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* ログアウト確認ダイアログ */}
      <Dialog
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
      >
        <DialogTitle>ログアウトの確認</DialogTitle>
        <DialogContent>
          <Typography>
            本当にログアウトしますか？
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLogoutConfirm(false)}>
            キャンセル
          </Button>
          <Button 
            color="error" 
            onClick={handleLogout}
          >
            ログアウト
          </Button>
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

export default ProfilePage; 