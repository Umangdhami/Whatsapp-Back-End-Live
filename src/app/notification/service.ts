import dotenv from "dotenv"
dotenv.config();
import moment from "moment"
import { RES_STATUS, RES_MESSAGE, STATUS_CODE } from "../../common/statusMessage";
import Chat from "../../model/chat";

class NotificationServices {

  async getNotificationChatService(req: any) {

    try {
      const { reciver_id, sender_id } = req.body;

      const chats = await Chat.find({
        reciver_id: reciver_id,
        sender_id: sender_id,
        is_read: 0,
      });

      return {
        status: RES_STATUS.E1,
        statusCode: STATUS_CODE.EC200,
        message: RES_MESSAGE.EM200,
        data: chats
      };
    } catch (err: any) {
      console.log('Error ', err)
      return {
        status: RES_STATUS.E2,
        statusCode: STATUS_CODE.EC500,
        message: RES_MESSAGE.EM500
      };
    }
  }
}


export default new NotificationServices();