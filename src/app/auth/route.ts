import express, { Request, Response } from 'express';
import AuthServices from './service'
import tokenVerify from '../../middlewares/tokenVerify';
class AuthRouter {
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }


  private userRegister = async (req: Request, res: Response) => {
    try {
      const result = await AuthServices.userRegisterService(req);
      res.json(result);
    } catch (error) {
      res.send(error);
    }
  };

  private userLogin = async (req: Request, res: Response) => {
    try {
      const result = await AuthServices.userLoginService(req);
      console.log('results', result)
      res.json(result);
    } catch (error) {
      res.send(error);
    }
  };

  private tokenVallid = async (req: Request, res: Response) => {
    try {
      const result = await AuthServices.tokenVallidService(req);
      res.json(result);
    } catch (error) {
      res.send(error);
    }
  };


  private initRoutes() {
    this.router.post('/userRegister', this.userRegister);
    this.router.post('/userLogin', this.userLogin);
    this.router.post('/token-valid', tokenVerify, this.tokenVallid);
   
  }
}

export default new AuthRouter().router;