import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Rating,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// アニメーション用の設定
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// スライダーの設定
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
};

// 料金プラン
const pricingPlans = [
  {
    title: 'フリープラン',
    price: '0',
    features: [
      'プロフィール閲覧',
      '毎日5件のマッチング',
      'AIチャット（月10回まで）',
      '基本機能へのアクセス'
    ],
    buttonText: '無料ではじめる',
    buttonColor: 'secondary',
    highlighted: false
  },
  {
    title: 'プレミアムプラン',
    price: '3,980',
    features: [
      '無制限のプロフィール閲覧',
      '無制限のマッチング',
      '無制限のAIチャット',
      'プレミアムイベントへの参加',
      '検索フィルター機能',
      'VIPサポート'
    ],
    buttonText: 'プレミアムに登録',
    buttonColor: 'primary',
    highlighted: true
  },
  {
    title: 'ビジネスプラン',
    price: '8,980',
    features: [
      'プレミアムの全機能',
      'ビジネスネットワーキング',
      '限定イベントへの優先参加',
      'パーソナルマッチングコーチ',
      'プロフィール優先表示'
    ],
    buttonText: 'ビジネスに登録',
    buttonColor: 'secondary',
    highlighted: false
  }
];

// 口コミ
const testimonials = [
  {
    name: '佐藤ゆかり',
    age: 28,
    comment: 'Love Matchのおかげで素敵な彼と出会えました！AIチャットが私の相性ピッタリの人を見つけてくれたんです。もう3ヶ月付き合っています♪',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    name: '田中健太',
    age: 32,
    comment: '仕事が忙しく出会いがなかったのですが、このアプリで今の彼女と出会えました。AIの会話アシストが本当に役立ちました！',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/men/33.jpg'
  },
  {
    name: '山本さくら',
    age: 25,
    comment: 'イベント機能が素晴らしいです！オンラインだけでなく実際に会える機会があるのが魅力的。他のマッチングアプリとは一線を画しています。',
    rating: 4,
    avatar: 'https://randomuser.me/api/portraits/women/64.jpg'
  }
];

// 特徴セクションの内容
const features = [
  {
    title: 'AI会話サポート',
    description: 'Gemini AIを搭載したチャットボットが、魅力的な会話をサポート。会話が途切れる心配はありません。',
    image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    title: 'パーソナライズドマッチング',
    description: '独自のアルゴリズムがあなたの好みや性格を分析し、最適なパートナーを見つけます。',
    image: 'https://images.unsplash.com/photo-1516575334481-f85287c2c82d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    title: 'リアルイベント参加',
    description: 'オンラインだけでなく、実際に会えるイベントも多数開催。自然な出会いのきっかけを提供します。',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    title: '安心・安全な環境',
    description: '厳格な認証システムと24時間監視で、安心して利用できる環境を提供しています。',
    image: 'https://images.unsplash.com/photo-1506377295141-e428b98cf521?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  }
];

// ヒーローセクションの画像
const heroImages = [
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
];

const HomePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box>
      {/* ヒーローセクション */}
      <Box sx={{ 
        width: '100%', 
        height: { xs: '70vh', md: '80vh' }, 
        overflow: 'hidden', 
        position: 'relative',
        mb: 5 
      }}>
        <Slider {...sliderSettings}>
          {heroImages.map((image, index) => (
            <Box key={index} sx={{ height: { xs: '70vh', md: '80vh' }, position: 'relative' }}>
              <Box sx={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 4,
                textAlign: 'center'
              }}>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  transition={{ duration: 0.8 }}
                >
                  <Typography
                    variant="h2"
                    component="h1"
                    sx={{
                      color: 'white',
                      fontWeight: 700,
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      mb: 2,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                    }}
                  >
                    Love Match
                  </Typography>
                </motion.div>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      color: 'white',
                      mb: 4,
                      maxWidth: 700,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                    }}
                  >
                    AIがサポートする次世代のマッチングサービス
                  </Typography>
                </motion.div>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <Button
                    component={Link}
                    to="/login"
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontSize: '1.1rem',
                      borderRadius: 8,
                      boxShadow: '0 4px 14px 0 rgba(255, 75, 145, 0.39)'
                    }}
                  >
                    今すぐはじめる
                  </Button>
                </motion.div>
              </Box>
            </Box>
          ))}
        </Slider>
      </Box>

      {/* 特徴セクション */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            component="h2" 
            variant="h3" 
            gutterBottom
            sx={{ fontWeight: 600, color: theme.palette.primary.main }}
          >
            Love Matchの特徴
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            最先端のAI技術を使った、まったく新しいマッチング体験をお届けします
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    height: '100%', 
                    overflow: 'hidden',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
                    borderRadius: 2,
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)'
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{ 
                      width: { xs: '100%', sm: 150 },
                      height: { xs: 200, sm: '100%' }
                    }}
                    image={feature.image}
                    alt={feature.title}
                  />
                  <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 実績セクション */}
      <Box sx={{ backgroundColor: '#f8f9fa', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              component="h2" 
              variant="h3" 
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Love Matchの実績
            </Typography>
            <Typography variant="h6" color="textSecondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              多くの方々に選ばれ、たくさんの幸せな出会いを創出しています
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.5 }}
              >
                <Card sx={{ 
                  textAlign: 'center', 
                  py: 4,
                  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
                  borderRadius: 2
                }}>
                  <Typography variant="h2" component="div" color="primary" sx={{ fontWeight: 700 }}>
                    30,000+
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    アクティブユーザー
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card sx={{ 
                  textAlign: 'center', 
                  py: 4,
                  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
                  borderRadius: 2
                }}>
                  <Typography variant="h2" component="div" color="primary" sx={{ fontWeight: 700 }}>
                    5,800+
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    成功したマッチング
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card sx={{ 
                  textAlign: 'center', 
                  py: 4,
                  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
                  borderRadius: 2
                }}>
                  <Typography variant="h2" component="div" color="primary" sx={{ fontWeight: 700 }}>
                    4.9
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    平均評価（5点満点）
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 料金プランセクション */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            component="h2" 
            variant="h3" 
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            料金プラン
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            あなたのニーズに合わせた最適なプランをお選びください
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {pricingPlans.map((plan, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: plan.highlighted 
                    ? '0 12px 20px rgba(255, 75, 145, 0.2)' 
                    : '0 5px 15px rgba(0, 0, 0, 0.08)',
                  borderRadius: 2,
                  position: 'relative',
                  overflow: 'hidden',
                  border: plan.highlighted ? `2px solid ${theme.palette.primary.main}` : 'none'
                }}>
                  {plan.highlighted && (
                    <Box sx={{ 
                      position: 'absolute', 
                      top: 15, 
                      right: -30, 
                      transform: 'rotate(45deg)',
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      px: 4,
                      py: 0.5,
                      fontWeight: 'bold',
                      fontSize: '0.75rem',
                      letterSpacing: 1,
                    }}>
                      人気
                    </Box>
                  )}
                  <CardContent sx={{ py: 4, textAlign: 'center', flexGrow: 1 }}>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                      {plan.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                      毎月のお支払い
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', mb: 2 }}>
                      <Typography variant="h3" component="span" sx={{ fontWeight: 700 }}>
                        ¥{plan.price}
                      </Typography>
                      {plan.price !== '0' && (
                        <Typography variant="body1" color="textSecondary" sx={{ ml: 1 }}>
                          /月
                        </Typography>
                      )}
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <List sx={{ px: 2 }}>
                      {plan.features.map((feature, idx) => (
                        <ListItem key={idx} sx={{ px: 0 }}>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Button
                      component={Link}
                      to="/login"
                      variant="contained"
                      color={plan.buttonColor as 'primary' | 'secondary'}
                      fullWidth
                      size="large"
                      sx={{
                        py: 1.5,
                        borderRadius: 8,
                        fontWeight: 600
                      }}
                    >
                      {plan.buttonText}
                    </Button>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 口コミセクション */}
      <Box sx={{ backgroundColor: '#f8f9fa', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              component="h2" 
              variant="h3" 
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              ユーザーの声
            </Typography>
            <Typography variant="h6" color="textSecondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Love Matchで素敵な出会いを見つけた方々の声をご紹介します
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
                    borderRadius: 2,
                    p: 3
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        sx={{ width: 64, height: 64, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {testimonial.age}歳
                        </Typography>
                        <Rating value={testimonial.rating} readOnly size="small" sx={{ mt: 0.5 }} />
                      </Box>
                    </Box>
                    <Typography variant="body1" sx={{ flexGrow: 1 }}>
                      "{testimonial.comment}"
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTAセクション */}
      <Box 
        sx={{ 
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          py: { xs: 6, md: 8 },
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            あなたの素敵な出会いを、今すぐ探しましょう
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ mb: 4, opacity: 0.9 }}
          >
            Love Matchを使えば、AIがあなたにぴったりのパートナーを見つけるお手伝いをします
          </Typography>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            color="secondary"
            size="large"
            sx={{
              py: 1.5,
              px: 4,
              fontSize: '1.1rem',
              borderRadius: 8,
              backgroundColor: 'white',
              color: theme.palette.primary.main,
              fontWeight: 600,
              boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)'
              }
            }}
          >
            無料ではじめる
          </Button>
        </Container>
      </Box>

      {/* フッター */}
      <Box
        sx={{
          backgroundColor: '#1a1a2e',
          color: 'white',
          py: 4
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Love Match
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7, mb: 2 }}>
                AIが支援する次世代のマッチングサービス。
                あなたにぴったりのパートナーを見つけるお手伝いをします。
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                リンク
              </Typography>
              <Box component="nav">
                <Link to="/" style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>
                  ホーム
                </Link>
                <Link to="/login" style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>
                  ログイン
                </Link>
                <Link to="/events" style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>
                  イベント
                </Link>
                <Link to="/matches" style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>
                  マッチング
                </Link>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                お問い合わせ
              </Typography>
              <Typography variant="body2" paragraph sx={{ opacity: 0.7 }}>
                ご質問やお問い合わせがありましたら、お気軽にご連絡ください。
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                メール: info@lovematch.example.com
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              &copy; {new Date().getFullYear()} Love Match. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage; 