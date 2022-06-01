import express, { Request, Response } from 'express';

import wrapAsync from '@/utils/wrapAsync';
import { getUserById } from '@/database/controllers/user';
import checkLoggedIn from './middleware';

const router = express.Router();

router.get(
  '/me',
  checkLoggedIn,
  wrapAsync(async (req: Request, res: Response) => {
    const userData = await getUserById(req.userId!);
    return res.json(userData);
  }),
);

export default router;
