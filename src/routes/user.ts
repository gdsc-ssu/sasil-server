import express from 'express';

const router = express.Router();

router.get('/me', (req, res) => {
  try {
    if (req.user) {
      res.status(200).json({ user: req.user });
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
