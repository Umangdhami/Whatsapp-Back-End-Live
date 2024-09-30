import dotenv from "dotenv"
dotenv.config();
import moment from "moment"
import { RES_STATUS, RES_MESSAGE, STATUS_CODE } from "../../common/statusMessage";
import Chat from "../../model/chat";
const getCurrentTime = () => moment().format("HH:mm");

class ChatServices {

  async saveChatService(req: any) {

    try {
      const { reciver_id, message, username } = req.body;
      const { _id } = req.user.user;

      const chat: any = await new Chat({
        sender_id: _id,
        reciver_id,
        message,
        sent_time: getCurrentTime(),
        reciver_username: username,
        sender_username: req.user.user.username,
        is_send: 1,
      });
      chat.save();

      return {
        status: RES_STATUS.E1,
        statusCode: STATUS_CODE.EC200,
        message: RES_MESSAGE.EM200,
        data: { ...chat, device_id: _id }
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

  async getChatService(req: any) {

    try {
      const { reciver_id } = req.body;
      const { _id } = req.user.user;

      const chats: any = await Chat.aggregate([
        {
          $match: {
            $or: [
              { sender_id: _id, reciver_id: reciver_id },
              { sender_id: reciver_id, reciver_id: _id },
            ],
          },
        },
      ]);

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

  async updateChatService(req: any) {

    try {
      const { msg } = req.body;
      const { id } = req.params;

      const chat = await Chat.findByIdAndUpdate(
        id,
        { message: msg, edited: 1 },
        { new: true }
      );

      return {
        status: RES_STATUS.E1,
        statusCode: STATUS_CODE.EC200,
        message: RES_MESSAGE.EM208,
        data: chat
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

  async chatSendService(req: any) {

    try {
      const { _id } = req.body;

      const chat = await Chat.findById(_id);

      if (chat) {
        return {
          status: RES_STATUS.E1,
          statusCode: STATUS_CODE.EC200,
          message: RES_MESSAGE.EM200,
          data: chat
        };
      } else {
        return {
          status: RES_STATUS.E1,
          statusCode: STATUS_CODE.EC410,
          message: RES_MESSAGE.EM410,
        };
      }
    } catch (err: any) {
      console.log('Error ', err)
      return {
        status: RES_STATUS.E2,
        statusCode: STATUS_CODE.EC500,
        message: RES_MESSAGE.EM500
      };
    }
  }

  async reciveChatSuccessService(req: any) {

    try {
      const { id } = req.body;
  
      const update = await Chat.findByIdAndUpdate(
        id,
        {
          is_recived: 1,
        },
        { new: true }
      );
  
      return {
        status: RES_STATUS.E1,
        statusCode: STATUS_CODE.EC200,
        message: RES_MESSAGE.EM208,
        data: update
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

  async deleteChatUsersideService(req: any) {

    try {
      const { id } = req.params;
  
      const chat = await Chat.findByIdAndUpdate(id, {
        delete_me: 1,
      });
  
      return {
        status: RES_STATUS.E1,
        statusCode: STATUS_CODE.EC200,
        message: RES_MESSAGE.EM210,
        data: chat
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

  async deleteChatBothsideService(req: any) {

    try {
      const { id } = req.params;
  
      const chat = await Chat.findByIdAndUpdate(
        id,
        { delete_everyone: 1 },
        { new: true } 
      )
      return {
        status: RES_STATUS.E1,
        statusCode: STATUS_CODE.EC200,
        message: RES_MESSAGE.EM210,
        data: chat
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


export default new ChatServices();