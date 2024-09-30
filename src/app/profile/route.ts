import express, { Request, Response } from 'express';
import ProfileServices from './service'
import { uploadProfile } from '../../middlewares/multer';
import tokenVerify from '../../middlewares/tokenVerify';

class ProfileRouter {
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }


  private updateProfile = async (req: Request, res: Response) => {
    try {
      console.log('object')
      const result = await ProfileServices.updateProfileService(req);
      res.json(result);
    } catch (error) {
      res.send(error);
    }
  };

  private getProfile = async (req: Request, res: Response) => {
    try {
      const result = await ProfileServices.getProfileService(req);
      res.json(result);
    } catch (error) {
      res.send(error);
    }
  };

  private updateProfilePic = async (req: Request, res: Response) => {
    try {
      console.log(req.file)
      const result = await ProfileServices.updateProfilePicService(req);
      res.json(result);
    } catch (error) {
      res.send(error);
    }
  };

  private updateProfileRegister = async (req: Request, res: Response) => {
    try {
      console.log(req.file)
      const result = await ProfileServices.updateProfileRegisterService(req);
      res.json(result);
    } catch (error) {
      res.send(error);
    }
  };

  private removeProfilePic = async (req: Request, res: Response) => {
    try {
      const result = await ProfileServices.removeProfilePicService(req);
      res.json(result);
    } catch (error) {
      res.send(error);
    }
  };


  private initRoutes() {
    this.router.post('/update-profile-register/:id', uploadProfile, this.updateProfileRegister);
    this.router.post('/updateProfile/:id', uploadProfile, tokenVerify, this.updateProfile);
    this.router.get('/get-profile', tokenVerify, this.getProfile);
    this.router.post('/update-profile-pic/:id', uploadProfile, tokenVerify, this.updateProfilePic);
    this.router.delete('/remove-profile-pic/:id', tokenVerify, this.removeProfilePic);
  }
}

export default new ProfileRouter().router;