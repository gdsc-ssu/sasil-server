export const DEV_SETTING = {
  port: '3065',
  redirectURI: {
    google: 'http://localhost:3000/auth/google/callback',
    kakao: 'http://localhost:3000/auth/kakao/callback',
    apple: 'http://localhost:3000/auth/apple/callback',
  },
  db: {
    host: 'localhost',
    port: '3306',
    database: 'sasil-dev',
  },
} as const;

// TODO 배포 모드 시 설정 추가
export const PROD_SETTING = {
  port: '',
  url: 'https://sasil.com',
  redirectURI: {
    google: '',
    kakao: '',
    apple: '',
  },
  db: {
    host: 'localhost',
    port: '3306',
    database: 'sasil',
  },
} as const;
