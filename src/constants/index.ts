export const DEV_SETTING = {
  port: '3065',
  clientURL: 'http://localhost:3000',
  redirectURI: {
    google: 'http://localhost:3065/auth/google/callback',
    kakao: 'http://localhost:3065/auth/kakao/callback',
    apple: 'http://localhost:3065/auth/apple/callback',
  },
  db: {
    port: '3306',
    database: 'sasil-dev',
  },
} as const;

// TODO 배포 모드 시 설정 추가
export const PROD_SETTING = {
  port: '80',
  clientURL: 'https://sasil.app',
  redirectURI: {
    google: 'https://api.sasil.app/auth/google/callback',
    kakao: 'https://api.sasil.app/auth/kakao/callback',
    apple: 'https://api.sasil.app/auth/apple/callback',
  },
  db: {
    port: '3306',
    database: 'sasil',
  },
} as const;
