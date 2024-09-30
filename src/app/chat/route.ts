import express, { Request, Response, NextFunction } from 'express';
import ChatServices from './service'
import tokenVerify from '../../middlewares/tokenVerify';

class ChatRouter {
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }


  private saveChat = async (req: Request, res: Response) => {
    try {
      const result = await ChatServices.saveChatService(req);
      res.json(result);
    } catch (error) {
      res.send(error);
    }
  };

  private getChat = async (req: Request, res: Response) => {
    try {
      const result = await ChatServices.getChatService(req);
      res.json(result);
    } catch (error) {
      res.send(error);
    }
  };

  private updateChat = async (req: Request, res: Response) => {
    try {
      const result = await ChatServices.updateChatService(req);
      res.json(result);
    } catch (error) {
      res.send(error);
    }
  };

  private chatSend = async (req: Request, res: Response) => {
    try {
      const result = await ChatServices.chatSendService(req);
      res.json(result);
    } catch (error) {
      res.send(error);
    }
  };

  private reciveChatSuccess = async (req: Request, res: Response) => {
    try {
      const result = await ChatServices.reciveChatSuccessService(req);
      res.json(result);
    } catch (error) {
      res.send(error);
    }
  };

  private deleteChatUserside = async (req: Request, res: Response) => {
    try {
      const result = await ChatServices.deleteChatUsersideService(req);
      res.json(result);
    } catch (error) {
      res.send(error);
    }
  };

  private deleteChatBothside = async (req: Request, res: Response) => {
    try {
      const result = await ChatServices.deleteChatBothsideService(req);
      res.json(result);
    } catch (error) {
      res.send(error);
    }
  };

  private initRoutes() {
    this.router.post('/save-chat', tokenVerify, this.saveChat);
    this.router.post('/get-chat', tokenVerify, this.getChat);
    this.router.post('/update-chat/:id', tokenVerify, this.updateChat);
    this.router.post('/chat-send', tokenVerify, this.chatSend);
    this.router.post('/recive-chat-success', tokenVerify, this.reciveChatSuccess);
    this.router.get('/delete-chat-userside/:id', tokenVerify, this.deleteChatUserside);
    this.router.get('/delete-chat-bothside/:id', tokenVerify, this.deleteChatBothside);
  }
}

export default new ChatRouter().router;