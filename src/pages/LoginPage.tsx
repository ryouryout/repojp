import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Divider,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

// アニメーション設定
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const LoginPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // ステート
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  // 入力バリデーション
  const isEmailValid = () => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isPasswordValid = () => {
    return password.length >= 6;
  };

  const isFormValid = () => {
    return isEmailValid() && isPasswordValid();
  };

  // ログイン処理
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      setError('正しい入力内容を確認してください');
      setShowAlert(true);
      return;
    }

    setLoading(true);
    
    try {
      // ダミーログイン処理（現段階では任意の値で成功）
      await new Promise(resolve => setTimeout(resolve, 1000));
      login({ email });
      navigate('/messages');
    } catch (err) {
      setError('ログインに失敗しました。入力内容を確認してください。');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  // パスワード表示切り替え
  const handleTogglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <Grid container spacing={0} sx={{ minHeight: '80vh' }}>
        {/* 左側のイメージエリア - モバイルでは表示しない */}
        {!isMobile && (
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: '100%',
                backgroundImage: 'url(https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '16px 0 0 16px',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '16px 0 0 16px',
                }
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  transition={{ duration: 0.5 }}
                >
                  <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                      color: 'white',
                      fontWeight: 700,
                      mb: 2,
                      textShadow: '1px 1px 3px rgba(0,0,0,0.3)'
                    }}
                  >
                    Love Match
                  </Typography>
                </motion.div>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'white',
                      mb: 4,
                      fontWeight: 400,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                    }}
                  >
                    AIがサポートする、あなたにぴったりの出会いを見つけるマッチングサービス
                  </Typography>
                </motion.div>
              </Box>
            </Box>
          </Grid>
        )}

        {/* 右側のフォームエリア */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={isMobile ? 3 : 0}
            sx={{
              p: { xs: 3, md: 4 },
              height: '100%',
              borderRadius: isMobile ? '16px' : '0 16px 16px 0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5 }}
            >
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  textAlign: { xs: 'center', md: 'left' }
                }}
              >
                ログイン
              </Typography>
            </motion.div>
            
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Typography
                variant="body1"
                sx={{ 
                  mb: 4, 
                  color: 'text.secondary',
                  textAlign: { xs: 'center', md: 'left' }
                }}
              >
                アカウント情報を入力してログインしてください
              </Typography>
            </motion.div>

            <form onSubmit={handleLogin}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <TextField
                  fullWidth
                  label="メールアドレス"
                  variant="outlined"
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={email !== '' && !isEmailValid()}
                  helperText={email !== '' && !isEmailValid() ? '有効なメールアドレスを入力してください' : ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <TextField
                  fullWidth
                  label="パスワード"
                  variant="outlined"
                  margin="normal"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={password !== '' && !isPasswordValid()}
                  helperText={password !== '' && !isPasswordValid() ? 'パスワードは6文字以上で入力してください' : ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </motion.div>

              <Box sx={{ textAlign: 'right', my: 1 }}>
                <Typography
                  variant="body2"
                  component="a"
                  href="#"
                  sx={{
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  パスワードをお忘れですか？
                </Typography>
              </Box>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    borderRadius: 8,
                    fontWeight: 600,
                    position: 'relative'
                  }}
                >
                  {loading ? (
                    <CircularProgress
                      size={24}
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px',
                      }}
                    />
                  ) : 'ログイン'}
                </Button>
              </motion.div>
            </form>

            <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
              <Divider sx={{ flexGrow: 1 }} />
              <Typography variant="body2" sx={{ px: 2, color: 'text.secondary' }}>
                または
              </Typography>
              <Divider sx={{ flexGrow: 1 }} />
            </Box>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                size="large"
                sx={{
                  mb: 2,
                  py: 1.5,
                  borderRadius: 8,
                  fontWeight: 600
                }}
                onClick={() => navigate('/signup')}
              >
                新規アカウント作成
              </Button>
            </motion.div>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                ログインすることで、
                <Typography
                  component="a"
                  href="#"
                  variant="body2"
                  sx={{
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  利用規約
                </Typography>
                {' '}および{' '}
                <Typography
                  component="a"
                  href="#"
                  variant="body2"
                  sx={{
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  プライバシーポリシー
                </Typography>
                に同意したものとみなします。
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* エラー通知 */}
      <Snackbar 
        open={showAlert} 
        autoHideDuration={6000} 
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowAlert(false)} 
          severity="error" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LoginPage; 