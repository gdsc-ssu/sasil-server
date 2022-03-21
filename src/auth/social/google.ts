import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
import { getUserByLoginInfo, addUser } from '@/database/controllers/user';

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogle = async (token: string) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (payload) {
    const email = payload.email!;
    const name = payload.name!;
    const loginType = 'google';

    let userData = await getUserByLoginInfo(email, loginType);
    if (!userData) {
      userData = await addUser(email, name, loginType);
    }
    return userData;
  }

  return null;
};

export default verifyGoogle;
