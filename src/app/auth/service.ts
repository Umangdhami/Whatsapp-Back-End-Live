import Profile from "../../model/profile";
import Register from "../../model/register";
import bcrypt from "bcrypt"
const saltRound = 10;
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();
const secretKey: any = process.env.SECRET_KEY;
import { RES_STATUS, RES_MESSAGE, STATUS_CODE } from "../../common/statusMessage";
import Login from "../../model/Login";

class AuthServices {

    async userRegisterService(req: any) {

        try {
            const { username, email, password, conf_pass, phone } = req.body;

            console.log(req.body)
            if (password === conf_pass) {
                const userExistEmail = await Register.findOne({ email });
                const userExistPhone = await Register.findOne({ phone });   

                if (userExistEmail || userExistPhone) {
                    return {
                        status: RES_STATUS.E1,
                        statusCode: STATUS_CODE.EC202,
                        message: RES_MESSAGE.EM207,
                        data: null,
                    };
                } else {
                    const hashPass = await bcrypt.hash(password, saltRound);

                    const user = new Register({
                        email,
                        password: hashPass,
                        phone,
                    });

                    const profile = new Profile({
                        username: "Test",
                        user_id: user.id,
                        profile_pic: "user.jpg",
                    });

                    await profile.save();
                    await user.save();
                    return {
                        status: RES_STATUS.E1,
                        statusCode: STATUS_CODE.EC200,
                        message: RES_MESSAGE.EM201,
                        data: user,
                        profile : profile
                    };
                }

            } else {
                return {
                    statusCode: STATUS_CODE.EC400,
                    status: RES_STATUS.E2,
                    message: RES_MESSAGE.EM206
                };
            }
        } catch (err: any) {
            console.log('Error ', err)
            return {
                message: RES_MESSAGE.EM500,
                statusCode: STATUS_CODE.EC500,
                status: RES_STATUS.E2
            };
        }
    }

    async userLoginService(req: any) {

        try {
            const { email, password } = req.body;

            const loginUser: any = await Login.findOne({ email });

            if (loginUser) {
                let valid: any = await jwt.verify(loginUser.token, secretKey, async (err: any, decoded: any) => {
                    if (err) {
                        return false
                    }

                    if (decoded) {
                        return true
                    }
                });

                if (valid) {
                    return {
                        status: RES_STATUS.E1,
                        statusCode: STATUS_CODE.EC400,
                        message: RES_MESSAGE.EM102,
                    };
                } else {
                    // await Login.findByIdAndDelete(loginUser.id);
                    // return {
                    //     status: RES_STATUS.E2,
                    //     statusCode: STATUS_CODE.EC401,
                    //     message: RES_MESSAGE.EM12
                    // };
                    const user: any = await Register.findOne({ email });

                    if (user) {
                        const dPass = await bcrypt.compare(password, user.password);

                        if (dPass) {
                            const token = jwt.sign({ user }, secretKey, { expiresIn: "3d" });

                            // const login = await new Login({
                            //     user_id: user.id,
                            //     email,
                            //     password: user.password,
                            //     token,
                            // });
                            // login.save();
                            // console.log('login done')
                            const login = await Login.findByIdAndUpdate(loginUser._id, {
                                token
                            })
                            // console.log('login done')
                            return {
                                status: RES_STATUS.E1,
                                statusCode: STATUS_CODE.EC200,
                                message: RES_MESSAGE.EM200,
                                data: { ...user, token },
                            };
                        } else {
                            return {
                                status: RES_STATUS.E2,
                                statusCode: STATUS_CODE.EC400,
                                message: RES_MESSAGE.EM206,
                            };
                        }
                    } else {
                        return {
                            status: RES_STATUS.E2,
                            statusCode: STATUS_CODE.EC410,
                            message: RES_MESSAGE.EM212,
                        };
                    }
                }
            } else {
                const user: any = await Register.findOne({ email });

                if (user) {
                    const dPass = await bcrypt.compare(password, user.password);

                    if (dPass) {
                        const token = jwt.sign({ user }, secretKey, { expiresIn: "3d" });

                        const login = await new Login({
                            user_id: user.id,
                            email,
                            password: user.password,
                            token,
                        });
                        login.save();
                        console.log('login done')
                        return {
                            status: RES_STATUS.E1,
                            statusCode: STATUS_CODE.EC200,
                            message: RES_MESSAGE.EM200,
                            data: { ...user, token },
                        };
                    } else {
                        return {
                            status: RES_STATUS.E2,
                            statusCode: STATUS_CODE.EC400,
                            message: RES_MESSAGE.EM206,
                        };
                    }
                } else {
                    return {
                        status: RES_STATUS.E2,
                        statusCode: STATUS_CODE.EC410,
                        message: RES_MESSAGE.EM212,
                    };
                }
            }

            // if (loginUser) {
            //     jwt.verify(loginUser.token, secretKey, async (err: any, decoded: any) => {
            //         if (err) {
            //             await Login.findByIdAndDelete(loginUser.id);
            //             return {
            //                 status: RES_STATUS.E2,
            //                 statusCode: STATUS_CODE.EC401,
            //                 message: RES_MESSAGE.EM12
            //             };
            //         }

            //         if (decoded) {
            //             return {
            //                 status: RES_STATUS.E1,
            //                 statusCode: STATUS_CODE.EC400,
            //                 message: RES_MESSAGE.EM102,
            //             };
            //         }
            //     });
            // } else {
            //     const user: any = await Register.findOne({ email });

            //     if (user) {
            //         const dPass = await bcrypt.compare(password, user.password);

            //         if (dPass) {
            //             const token = jwt.sign({ user }, secretKey, { expiresIn: "10s" });

            //             const login = await new Login({
            //                 user_id: user.id,
            //                 email,
            //                 password: user.password,
            //                 token,
            //             });
            //             login.save();
            //             console.log('login done')
            //             return {
            //                 status: RES_STATUS.E1,
            //                 statusCode: STATUS_CODE.EC200,
            //                 message: RES_MESSAGE.EM200,
            //                 data: { ...user, token },
            //             };
            //         } else {
            //             return {
            //                 status: RES_STATUS.E2,
            //                 statusCode: STATUS_CODE.EC400,
            //                 message: RES_MESSAGE.EM206,
            //             };
            //         }
            //     } else {
            //         return {
            //             status: RES_STATUS.E2,
            //             statusCode: STATUS_CODE.EC410,
            //             message: RES_MESSAGE.EM212,
            //         };
            //     }
            // }
        } catch (err: any) {
            console.log('Error ', err)
            return {
                message: RES_MESSAGE.EM500,
                statusCode: STATUS_CODE.EC500,
                status: RES_STATUS.E2
            };
        }
    }

    async tokenVallidService(req: any) {

        try {

            if (!req.user) {
                return {
                    status: RES_STATUS.E2,
                    statusCode: STATUS_CODE.EC401,
                    message: RES_MESSAGE.EM11,
                };
            }

            return {
                status: RES_STATUS.E1,
                statusCode: STATUS_CODE.EC200,
                message: RES_MESSAGE.EM10,
            };

        } catch (err: any) {
            console.log('Error ', err)
            return {
                message: RES_MESSAGE.EM500,
                statusCode: STATUS_CODE.EC500,
                status: RES_STATUS.E2
            };
        }
    }

}


export default new AuthServices();