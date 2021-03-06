export const DEV_SETTING = {
  mode: 'dev',
  port: '4000',
  clientURL: 'http://localhost:3000',
  redirectURI: {
    google: 'http://localhost:4000/auth/google/callback',
    kakao: 'http://localhost:4000/auth/kakao/callback',
    apple: 'http://localhost:4000/auth/apple/callback',
  },
  db: {
    port: '3306',
    database: 'sasil-dev',
  },
  morganMode: 'dev',
} as const;

export const PROD_SETTING = {
  mode: 'prod',
  port: '4000',
  clientURL: 'https://sasil.app',
  redirectURI: {
    google: 'https://api.sasil.app/auth/google/callback',
    kakao: 'https://api.sasil.app/auth/kakao/callback',
    apple: 'https://sasil.app/login',
  },
  db: {
    port: '3306',
    database: 'sasil',
  },
  morganMode: 'combined',
} as const;
