import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/dataBase';
import userRoute from "./routes/user.route"
import path from 'path';
import cors from "cors";


dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


app.use((req, _, next) => {
  console.log("➡️", req.method, req.url);
  next();
});

app.use("/api/user", userRoute);

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});