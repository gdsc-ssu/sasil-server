export const DEV_SETTING = {
  port: '3065',
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
  db: {
    host: 'localhost',
    port: '3306',
    database: 'sasil',
  },
};
