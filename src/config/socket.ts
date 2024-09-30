import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import registerModel from "../model/register";
import chatModel from "../model/chat";

const secretKey = process.env.SECRET_KEY as string;

export const initSocket = (io: Server) => {
  const usp = io.of("/api/socket/user-namespace");

  usp.on("connection", async (socket: Socket) => {
    const token = socket.handshake.auth.token as string;
    // console.log('socket connection', token)
    jwt.verify(token, secretKey, async (err, decoded: any) => {
      if (err) {
        console.error("Token verification failed:", err);
        socket.disconnect();
      } else {
        try {
          const id = decoded.user._id;
          await registerModel.findByIdAndUpdate(id, { is_online: "1" });

          socket.broadcast.emit("getOnlineUser", id);

          socket.on("disconnect", async () => {
            try {
              await registerModel.findByIdAndUpdate(id, { is_online: "0" });
              socket.broadcast.emit("getOfflineUser", id);
            } catch (error) {
              console.error("Error updating user's online status:", error);
            }
          });

          socket.on("chatRead", async (data) => {
            if (data.length != 0) {
              const unreadChats = data.filter((chat: any) => chat.is_read == 0);

              unreadChats.forEach(async (chat: any) => {
                await chatModel.findByIdAndUpdate(chat._id, { is_read: 1 });
              });

              socket.broadcast.emit("chatReadSuccess", unreadChats);
            }
          });

          socket.on("chatReciveNotification", (data) => {
            socket.broadcast.emit("chatReciveNotificationSuccess", data);
          });

          socket.on("newChat", async (data) => {
            jwt.verify(data.token, secretKey, async (err:any, decoded: any) => {
              if (err) {
                console.error("Token verification failed:", err);
                socket.disconnect();
              } else {
                const { sender_id, reciver_id, sent_time, message, username, _id } = data;
                let chat = new chatModel({
                  _id: _id,
                  reciver_username: username,
                  sender_username: decoded.user.username,
                  sender_id,
                  reciver_id,
                  is_send: 1,
                  sent_time,
                  message,
                });
                await chat.save();
                socket.broadcast.emit("loadNewChat", chat);
              }
            });
          });

          socket.on("chatSend", (data) => {
            socket.broadcast.emit("chatSendSuccess", data);
            socket.broadcast.emit("chatSendSuccess2", data);
          });

          socket.on("delete-chat", async (id, senderId) => {
            const chat = await chatModel.findById(id);

            if (chat) {
              socket.broadcast.emit("chatMessageDeleted", chat, senderId);
            } else {
              socket.broadcast.emit("chatMessageDeleted", id, senderId);
            }
          });

          socket.on("chatRecived", async (id) => {
            const chat = await chatModel.findByIdAndUpdate(
              id,
              { is_recived: 1 },
              { new: true }
            );
            socket.broadcast.emit("chatRecivedSuccess", chat);
          });

          socket.on("editChat", (data) => {
            socket.broadcast.emit("updateChat", data);
          });

          socket.on('reciveChat', () => {
            socket.broadcast.emit('reciveChatToUser');
          });

        } catch (error) {
          console.error("Error updating user's online status:", error);
          socket.disconnect();
        }
      }
    });
  });
};
