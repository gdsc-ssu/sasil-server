import passport from 'passport';
import { Request, Response, NextFunction } from 'express';

/*
checkLoggedIn 미들웨어로 jwt가 검증되고, 유저데이터를 req.user에 전달해준다.
각 router에서는 req.user로 받아온 id값을 가지고 controller를 불러와 원하는 결과를 전송한다.
*/
const checkLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(401).send('로그인이 필요한 요청입니다.');
    }
  })(req, res, next);
};

export default checkLoggedIn;
