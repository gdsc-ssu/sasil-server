import express from 'express';
import checkLoggedIn from './middleware';

const router = express.Router();

router.get('/me', checkLoggedIn, async (req, res) => {
  try {
    if (req.user) {
      res.status(200).json(req.user);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.log(error);
  }
});

export default router;
