import Register from "../../model/register";
import dotenv from "dotenv"
dotenv.config();
import mongoose from "mongoose"
import { RES_STATUS, RES_MESSAGE, STATUS_CODE } from "../../common/statusMessage";

class UserServices {

  async getChatUserService(req: any) {

    try {
      const { _id } = req.user.user;
      const objectId = new mongoose.Types.ObjectId(_id);

      const users = await Register.aggregate([
        {
          $match: {
            _id: { $ne: objectId },
          },
        },
        {
          $lookup: {
            from: "profiles",
            localField: "_id",
            foreignField: "user_id",
            as: "profiles",
          },
        },
        {
          $unwind: {
            path: "$profiles",
            preserveNullAndEmptyArrays: true, 
          },
        },

        {
          $project: {
            _id: 1, 
            email: 1,
            phone: 1,
            is_online: 1,
            profile: {
              username: "$profiles.username",
              user_id: "$profiles.user_id",
              profile_pic: {
                $cond: {
                  if: { $ifNull: ["$profiles.profile_pic", false] },
                  then: {
                    $concat: [
                      `${process.env.IMAGE_ACCESS_PATH}/profileImg/`,
                      "$profiles.profile_pic",
                    ],
                  },
                  else: null,
                },
              },
            },
          },
        },
      ]);

      return {
        status: RES_STATUS.E1,
        statusCode: STATUS_CODE.EC200,
        message: RES_MESSAGE.EM200,
        data: users
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

  async getSingleUserService(req: any) {

    try {
      const { id } = req.params;
      const objectId = new mongoose.Types.ObjectId(id);
      const singleUser = await Register.findById(id);

      if (!singleUser) {
        return {
          status: RES_STATUS.E1,
          statusCode: STATUS_CODE.EC410,
          message: RES_MESSAGE.EM410,
        };
      }
      const singleUsers = await Register.aggregate([
        {
          $match: {
            _id: objectId,
          },
        },
        {
          $lookup: {
            from: "profiles",
            localField: "_id",
            foreignField: "user_id",
            as: "profiles",
          },
        },
        {
          $unwind: {
            path: "$profiles",
            preserveNullAndEmptyArrays: true, 
          },
        },

        {
          $project: {
            sender_id: req.user.user?._id,
            _id: 1,
            email: 1,
            phone: 1,
            is_online: 1,
            profile: {
              username: "$profiles.username",
              user_id: "$profiles.user_id",
              profile_pic: {
                $cond: {
                  if: { $ifNull: ["$profiles.profile_pic", false] },
                  then: {
                    $concat: [
                      `${process.env.IMAGE_ACCESS_PATH}/profileImg/`,
                      "$profiles.profile_pic",
                    ],
                  },
                  else: null,
                },
              },
            },
          },
        },
      ]);

      let user = {
        ...singleUser.toObject(),
      };

      return {
        status: RES_STATUS.E1,
        statusCode: STATUS_CODE.EC200,
        message: RES_MESSAGE.EM200,
        data: singleUsers
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

  async getLoginUserService(req: any) {

    try {
      const id = req.user.user?._id;
      const objectId = new mongoose.Types.ObjectId(id);
      const singleUser = await Register.findById(id);

      if (!singleUser) {
        return {
          status: RES_STATUS.E1,
          statusCode: STATUS_CODE.EC410,
          message: RES_MESSAGE.EM410,
        };
      }
      const singleUsers = await Register.aggregate([
        {
          $match: {
            _id: objectId,
          },
        },
        {
          $lookup: {
            from: "profiles",
            localField: "_id",
            foreignField: "user_id",
            as: "profiles",
          },
        },
        {
          $unwind: {
            path: "$profiles",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $project: {
            sender_id: req.user.user?._id,
            _id: 1,
            email: 1,
            phone: 1,
            is_online: 1,
            profile: {
              username: "$profiles.username",
              user_id: "$profiles.user_id",
              profile_pic: {
                $cond: {
                  if: { $ifNull: ["$profiles.profile_pic", false] },
                  then: {
                    $concat: [
                      `${process.env.IMAGE_ACCESS_PATH}/profileImg/`,
                      "$profiles.profile_pic",
                    ],
                  },
                  else: null,
                },
              },
            },
          },
        },
      ]);

      return {
        status: RES_STATUS.E1,
        statusCode: STATUS_CODE.EC200,
        message: RES_MESSAGE.EM200,
        data: singleUsers
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


export default new UserServices();