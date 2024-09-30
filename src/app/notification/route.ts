import express, { Request, Response } from 'express';
import NotificationServices from './service'

class NotificationRouter {
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }


  private getNotificationChat = async (req: Request, res: Response) => {
    try {
      const result = await NotificationServices.getNotificationChatService(req);
      res.json(result);
    } catch (error) {
      res.send(error);
    }
  };


  private initRoutes() {
    this.router.post('/get-notification-chat', this.getNotificationChat);
  }
}

export default new NotificationRouter().router;