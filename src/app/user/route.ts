import express, { Request, Response, NextFunction } from 'express';
import UserServices from './service'
import tokenVerify from '../../middlewares/tokenVerify';

class UserRouter {
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }


  private getChatUser = async (req: Request, res: Response) => {
    try {
      const result = await UserServices.getChatUserService(req);
      res.json(result);
    } catch (error) {
      res.send(error);
    }
  };

  private getSingleUser = async (req: Request, res: Response) => {
    try {
      const result = await UserServices.getSingleUserService(req);
      res.json(result);
    } catch (error) {
      res.send(error);
    }
  };

  private getLoginUser = async (req: Request, res: Response) => {
    try {
      const result = await UserServices.getLoginUserService(req);
      res.json(result);
    } catch (error) {
      res.send(error);
    }
  };


  private initRoutes() {
    this.router.get('/getChatUser', tokenVerify, this.getChatUser);
    this.router.get('/getSingleUser/:id', tokenVerify, this.getSingleUser);
    this.router.get('/getLoginUser', tokenVerify, this.getLoginUser);
  }
}

export default new UserRouter().router;