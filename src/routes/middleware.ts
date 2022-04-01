import { Request, Response, NextFunction } from 'express';
import { jwtVerify } from '@/auth/jwt';

/**
checkLoggedIn 미들웨어로 jwt가 검증되고, 유저데이터를 req.user에 전달해준다.
각 router에서는 req.user로 받아온 id값을 가지고 controller를 불러와 원하는 결과를 전송한다.
*/
const checkLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization;

  if (token) {
    const user = await jwtVerify(token);

    if (user) {
      req.user = user;
      next();
    } else {
      res.status(401).send('로그인이 필요한 요청입니다.');
    }
  }
};

export default checkLoggedIn;
