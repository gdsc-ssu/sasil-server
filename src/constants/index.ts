export const DEV_SETTING = {
  port: '3065',
  clientURL: 'http://localhost:3000',
  redirectURI: {
    google: 'http://localhost:3065/auth/google/callback',
    kakao: 'http://localhost:3065/auth/kakao/callback',
    apple: 'http://localhost:3065/auth/apple/callback',
  },
  db: {
    host: '127.0.0.1',
    port: '3306',
    database: 'sasil-dev',
  },
} as const;

// TODO 배포 모드 시 설정 추가
export const PROD_SETTING = {
  port: '',
  clientURL: 'https://sasil.app',
  redirectURI: {
    google: '',
    kakao: '',
    apple: '',
  },
  db: {
    host: '127.0.0.1',
    port: '3306',
    database: 'sasil',
  },
} as const;
