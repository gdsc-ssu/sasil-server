import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const prod: boolean = process.env.NODE_ENV === 'production';

const app = express();
app.set('port', prod ? process.env.PORT : 3065);

app.listen(app.get('port'), () => {
  console.log(`server is running on ${app.get('port')}`);
});
