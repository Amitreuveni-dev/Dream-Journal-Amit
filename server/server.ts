import express, { Express, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';


dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});