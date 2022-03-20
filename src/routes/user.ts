import express from 'express';

import { checkLoggedin, checkLoggedout } from '@/routes/middlewares';

const router = express.Router();

router.get('/me', checkLoggedin, (req, res) => {
  try {
    if (req.user) {
      res.status(200).json({ user: req.user }); // TODO: 받아올 데이터 수정
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.log(error);
  }
});

router.post('/logout', checkLoggedin, (req, res) => {
  req.logout();
  if (req.session) {
    req.session.destroy((e) => console.log(e));
  }
});

export default router;
