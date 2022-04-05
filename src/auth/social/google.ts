import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
import { getUserByLoginInfo, addUser } from '@/database/controllers/user';

dotenv.config();

interface UserAuthData {
  email: string;
  name: string;
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogle = async (token: string) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload() as UserAuthData;

    if (payload) {
      const { email, name } = payload;
      const loginType = 'google';

      let userData = await getUserByLoginInfo(email, loginType);
      if (!userData) {
        userData = await addUser(email, name, loginType);
      }
      return userData;
    }
  } catch (error) {
    console.log(error);
  }

  return null;
};

export default verifyGoogle;
