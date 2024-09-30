import Profile from "../../model/profile";
import Register from "../../model/register";
import dotenv from "dotenv"
dotenv.config();
const secretKey: any = process.env.SECRET_KEY;
import fs from "fs"
import path from "path"
import moment from "moment"
import { RES_STATUS, RES_MESSAGE, STATUS_CODE } from "../../common/statusMessage";
import mongoose from "mongoose";

class ProfileServices {

  async updateProfileRegisterService(req: any) {

    try {
      const { id } = req.params;
      const { username, user_id } = req.body;
      let file = req.file;

      const user_profile: any = await Profile.findOne({ user_id, _id : id });

      if (req.file) {
        if (
          user_profile.profile_pic !== "user.jpg" &&
          fs.existsSync(
            path.join(__dirname, `../public/profileImg/${user_profile.profile_pic}`)
          )
        ) {
          fs.unlinkSync(
            path.join(__dirname, `../public/profileImg/${user_profile.profile_pic}`)
          );
        }

        file = file.filename;
      } else {
        file = user_profile.profile_pic;
      }

      if (user_profile) {
        const profile = await Profile.findByIdAndUpdate(
          user_profile.id,
          { username, profile_pic: file },
          { new: true }
        );

        const user = await Register.findByIdAndUpdate(id, {
          username,
        });

        return {
          status: RES_STATUS.E1,
          statusCode: STATUS_CODE.EC200,
          message: RES_MESSAGE.EM208,
          data: profile,
        };
      } else {
        return {
          status: RES_STATUS.E2,
          statusCode: STATUS_CODE.EC410,
          message: RES_MESSAGE.EM410
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

  async updateProfileService(req: any) {

    try {
      const { id } = req.params;
      const { username } = req.body;
      const user_id = req.user.user._id
      let file = req.file;

      console.log(id, 'id')
      console.log(user_id, 'user_id')


      const user_profile: any = await Profile.findOne({ _id : id, user_id });

      console.log(user_profile, 'user_profile')

      if (req.file) {
        if (
          user_profile?.profile_pic !== "user.jpg" &&
          fs.existsSync(
            path.join(__dirname, `../public/profileImg/${user_profile?.profile_pic}`)
          )
        ) {
          fs.unlinkSync(
            path.join(__dirname, `../public/profileImg/${user_profile?.profile_pic}`)
          );
        }

        file = file.filename;
      } else {
        file = user_profile?.profile_pic;
      }

      if (user_profile) {
        const profile:any = await Profile.findByIdAndUpdate(
          user_profile.id,
          { username : req.body?.username ? req.body.username : user_profile.username, profile_pic: file },
          { new: true }
        );

        const user = await Register.findByIdAndUpdate(id, {
          username,
        });

       let pic =  profile?.profile_pic  
       //@ts-ignore
       profile?.profile_pic  = `${process.env.IMAGE_ACCESS_PATH}/profileImg/${pic}`

       console.log(1234567890,{
        status: RES_STATUS.E1,
        statusCode: STATUS_CODE.EC200,
        message: RES_MESSAGE.EM208,
        data: profile,
      })

       return {
          status: RES_STATUS.E1,
          statusCode: STATUS_CODE.EC200,
          message: RES_MESSAGE.EM208,
          data: profile,
        };
      } else {
        return {
          status: RES_STATUS.E2,
          statusCode: STATUS_CODE.EC410,
          message: RES_MESSAGE.EM410
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

  async getProfileService(req: any) {

    try {
      const { _id } = req.user.user;
      const objectId = new mongoose.Types.ObjectId(_id);
      const singleUser = await Register.findById(_id);

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
            sender_id: req.user.user._id,
            _id: 1,
            email: 1,
            phone: 1,
            is_online: 1,
            profile: {
              _id: "$profiles._id",
              username: "$profiles.username",
              user_id: "$profiles.user_id",
              profile_pic: {
                $cond: {
                  if: { $ifNull: ["$profiles.profile_pic", false] },
                  then: {
                    $concat: [
                      `${process.env.IMAGE_ACCESS_PATH}/profileimg/`,
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

    // try {
    //   const user = req.user;

    //   let file = req.file;

    //   const user_profile: any = await Profile.findOne({ user_id: id });

    //   if (req.file) {
    //     if (
    //       user_profile.profile_pic !== "user.jpg" &&
    //       fs.existsSync(
    //         path.join(__dirname, `../public/profileImg/${user_profile.profile_pic}`)
    //       )
    //     ) {
    //       fs.unlinkSync(
    //         path.join(__dirname, `../public/profileImg/${user_profile.profile_pic}`)
    //       );
    //     }

    //     file = file.filename;
    //   } else {
    //     file = user_profile.profile_pic;
    //   }

    //   if (user_profile) {
    //     const profile = await Profile.findByIdAndUpdate(
    //       user_profile.id,
    //       { username, profile_pic: file },
    //       { new: true }
    //     );

    //     const user = await Register.findByIdAndUpdate(id, {
    //       username,
    //     });

    //     return {
    //       status: RES_STATUS.E1,
    //       statusCode: STATUS_CODE.EC200,
    //       message: RES_MESSAGE.EM208,
    //       data: profile,
    //     };
    //   } else {
    //     return {
    //       status: RES_STATUS.E2,
    //       statusCode: STATUS_CODE.EC410,
    //       message: RES_MESSAGE.EM410
    //     };
    //   }
    // } catch (err: any) {
    //   console.log('Error ', err)
    //   return {
    //     status: RES_STATUS.E2,
    //     statusCode: STATUS_CODE.EC500,
    //     message: RES_MESSAGE.EM500
    //   };
    // }
  }

  async updateProfilePicService(req: any) {

    try {
      const { id } = req.params;
      const { _id } = req.user.user;
      let file = req.file;
      console.log(id, _id)
      const path = process.cwd()

      const user_profile: any = await Profile.findOne({ _id: id, user_id: _id });

      if (req.file && user_profile) {
        console.log('profile1', path)
        if ( user_profile.profile_pic !== "user.jpg" && fs.existsSync(`${path}/public/profileImg/${user_profile.profile_pic}`)) {
          fs.unlinkSync(`${path}/public/profileImg/${user_profile.profile_pic}`);
        }

        file = file.filename;
      } else {
        file = user_profile.profile_pic;
      }

      if (user_profile) {
        const profile:any = await Profile.findByIdAndUpdate(
          id,
          { profile_pic: file },
          { new: true }
        );

        const filePath:string = `${process.env.IMAGE_ACCESS_PATH}/profileImg/${profile?.profile_pic}`
        profile.profile_pic = filePath;

        return {
          status: RES_STATUS.E1,
          statusCode: STATUS_CODE.EC200,
          message: RES_MESSAGE.EM208,
          data: profile,
        };
      } else {
        return {
          status: RES_STATUS.E2,
          statusCode: STATUS_CODE.EC410,
          message: RES_MESSAGE.EM410
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

  async removeProfilePicService(req: any) {

    try {
      const { id } = req.params;
      const { _id } = req.user.user;
      const path = process.cwd()

      const user_profile: any = await Profile.findOne({ _id: id, user_id: _id });

      if (user_profile) {

        if ( user_profile.profile_pic !== "user.jpg" && fs.existsSync(`${path}/public/profileImg/${user_profile.profile_pic}`)) {
          fs.unlinkSync(`${path}/public/profileImg/${user_profile.profile_pic}`);
        }
        
        const profile:any = await Profile.findByIdAndUpdate(
          id,
          { profile_pic: 'user.jpg' },
          { new: true }
        );

        const filePath:string = `${process.env.IMAGE_ACCESS_PATH}/profileImg/${profile?.profile_pic}`
        profile.profile_pic = filePath;

        return {
          status: RES_STATUS.E1,
          statusCode: STATUS_CODE.EC200,
          message: RES_MESSAGE.EM208,
          data: profile,
        };
      } else {
        return {
          status: RES_STATUS.E2,
          statusCode: STATUS_CODE.EC410,
          message: RES_MESSAGE.EM410
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

}


export default new ProfileServices();