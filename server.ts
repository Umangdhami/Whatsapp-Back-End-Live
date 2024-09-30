import express from "express";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import moment from "moment";
import mongoose from './src/config/dbConnection'
import LoginModel from "./src/model/Login";
import registerModel from "./src/model/register";
import chatModel from "./src/model/chat";
import { initSocket } from "./src/config/socket";
mongoose
import authRoute from './src/app/auth/route'
import profileRoute from './src/app/profile/route'
import userRoute from './src/app/user/route'
import chatRoute from './src/app/chat/route'
import notificationRoute from './src/app/notification/route'
import fs from 'fs'

const app = express();
const port = 5011;
const secretKey = process.env.SECRET_KEY as string;

const getCurrentTime = () => moment().format("HH:mm");

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO server with CORS options
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

// CORS configuration
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Static file serving
app.use(express.static(path.join(process.cwd(), "./dist/public/")));
// app.use(express.static(path.join(__dirname, './public/')));
console.log('ok path', process.cwd())
app.use(
  `${process.env.IMAGE_FILE}`,
  express.static(`.${process.env.IMAGE_FILE}`)
);

// Set view engine to EJS
app.set("view engine", "ejs");

// Body parser middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Socket.IO namespace for users
initSocket(io);
app.get("/umang", (req:any, res:any) => res.send('umang'));
app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoute);
app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/notification", notificationRoute);


// Route handling

// Start the server
// const dirPath2 = process.cwd();
// fs.readdir(dirPath2, (err, files) => {
//   if (err) {
//     console.error('Error reading directory:', err);
//     return;
//   }
//   const folders = files.filter(file => fs.statSync(path.join(dirPath, file)).isDirectory());
//   console.log(`Folders: ${folders.join(', ')}`);
// });

const dirPath = `${process.cwd()}/dist/public`
fs.readdir(dirPath, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }
  const folders = files.filter(file => fs.statSync(path.join(dirPath, file)).isDirectory());
  console.log(`Folders: ${folders.join(', ')}`);
});

console.log(express.static(process.cwd() + "./public/"))
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
