import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const databaseUrl = process.env.DATABASE_URL as string;
const databaseName = process.env.DATABASE_NAME as string;

mongoose.connect(`${databaseUrl}${databaseName}`)
  .then(() => {
    console.log('Database Connected...');
  })
  .catch((err) => {
    console.error('Database Error...', err);
  });

export default mongoose;
