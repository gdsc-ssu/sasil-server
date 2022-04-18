import express from 'express';

import { getUserById } from '@/database/controllers/user';
import checkLoggedIn from './middleware';

const router = express.Router();

router.get('/me', checkLoggedIn, async (req, res) => {
  try {
    if (req.userId) {
      const userData = await getUserById(req.userId);
      res.status(200).json(userData);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.log(error);
  }
});

export default router;
