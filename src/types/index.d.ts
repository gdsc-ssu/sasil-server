import UserEntity from '@/database/entity/user';

declare global {
  namespace Express {
    interface User extends UserEntity {}
    interface Request {
      userId?: number;
    }
  }
}
