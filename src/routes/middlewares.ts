import passport from 'passport';
import { Request, Response, NextFunction } from 'express';

const checkLoggedin = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    console.log(user);
    if (user) {
      console.log(user);
      req.user = user;
      next();
    } else {
      res.status(401).send('로그인이 필요합니다.');
    }
  })(req, res, next);
};

export default checkLoggedin;
