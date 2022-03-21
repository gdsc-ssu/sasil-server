import passport from 'passport';
import jwtStrategy from '@/auth/jwt';

const passportConfig = () => {
  passport.use('jwt', jwtStrategy);
};

export default passportConfig;
