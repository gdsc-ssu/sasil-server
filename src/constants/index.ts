export const DEV_SETTING = {
  port: '3065',
  redirectURIGoogle: 'http://localhost:3000/auth/google/callback',
  redirectURIKakao: 'http://localhost:3000/auth/kakao/callback',
  redirectURIApple: 'http://localhost:3000/auth/apple/callback',
  db: {
    host: 'localhost',
    port: '3306',
    database: 'sasil-dev',
  },
};

// TODO 배포 모드 시 설정 추가
export const PROD_SETTING = {
  port: '',
  url: 'https://sasil.com',
  redirectURIGoogle: '',
  redirectURIKakao: '',
  redirectURIApple: '',
  db: {
    host: 'localhost',
    port: '3306',
    database: 'sasil',
  },
};
