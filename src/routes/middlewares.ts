import { Request, Response, NextFunction } from 'express';

export const checkLoggedin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send('로그인이 필요합니다.');
  }
};

export const checkLoggedout = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send('로그아웃이 필요합니다.');
  }
};
