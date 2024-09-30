import { Request, Response } from 'express';
import multer, { StorageEngine } from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs'
dotenv.config();

const storage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: CallableFunction) => {
    // if(!fs.existsSync(path.join(__dirname, `${process.env.PROFILE_IMAGE}`))){
    //   fs.mkdirSync(path.join(__dirname, `${process.env.PROFILE_IMAGE}`));
    // }
    cb(null, path.join(__dirname, `${process.env.PROFILE_IMAGE}`));
  },
  filename: (req: Request, file: Express.Multer.File, cb: CallableFunction) => {
    const fileName = Date.now() + "-" + Math.round(Math.random() * 100000) + "-" + file.originalname;
    cb(null, fileName);
  },
});

const uploadProfile = multer({ storage }).single("profile_pic");

export { uploadProfile };
