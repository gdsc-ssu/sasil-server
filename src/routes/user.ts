import express from 'express';
import checkLoggedin from './middleware';

const router = express.Router();

router.get('/myInfo', checkLoggedin, async (req, res) => {
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

router.post('/logout', (req, res) => {
  req.logout();
});

export default router;
