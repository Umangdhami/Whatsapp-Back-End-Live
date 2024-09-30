import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import Login from '../model/Login';
import { RES_MESSAGE, RES_STATUS, STATUS_CODE } from '../common/statusMessage';
dotenv.config();

const secretKey = process.env.SECRET_KEY as string;

interface CustomRequest extends Request {
  user?: JwtPayload;
}

const tokenVerify = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const token: any = req.header('Authorization')?.replace('Bearer ', '');
    console.log(token, 'token',8009876543211)

    if (!token) {
      console.log(token, 'invalid',8009876543211)
      res.json(
        {
          status: RES_STATUS.E2,
          statusCode: STATUS_CODE.EC401,
          message: RES_MESSAGE.EM12
        }
      )
    }
    const user:any = await Login.findOne({ token })
    console.log(user.token, 'use.token',8009876543211)
    if (user) {
      jwt.verify(token, secretKey, (err: any, decoded: any) => {
        if (err) {
          res.json(
            {
              status: RES_STATUS.E2,
              statusCode: STATUS_CODE.EC401,
              message: RES_MESSAGE.EM12
            }
          )
          // res.status(401).json({
          //   status: false,
          //   message: 'Token Not Valid....',
          // });
        } else {
          if (decoded) {
            req.user = decoded;
            next();
          } else {
            res.json(
              {
                status: RES_STATUS.E2,
                statusCode: STATUS_CODE.EC401,
                message: RES_MESSAGE.EM12
              }
            )
            // res.status(401).json({
            //   status: false,
            //   message: 'Token Not Valid....',
            // });
          }
        }
      });
    } else {
      res.json(
        {
          status: RES_STATUS.E2,
          statusCode: STATUS_CODE.EC401,
          message: RES_MESSAGE.EM12
        }
      )
    }

    // if (token) {
    //   jwt.verify(token, secretKey, (err: any, decoded: any) => {
    //     if (err) {
    //       res.status(401).json({
    //         status: false,
    //         message: 'Token Not Valid....',
    //       });
    //     } else {
    //       if (decoded) {
    //         req.user = decoded;
    //         next();
    //       } else {
    //         res.status(401).json({
    //           status: false,
    //           message: 'Token Not Valid....',
    //         });
    //       }
    //     }
    //   });
    // } else {
    //   res.status(400).json({
    //     status: false,
    //     message: 'Please provide Token...',
    //   });
    // }
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
      message: 'Internal Server Error',
    });
  }
};

export default tokenVerify;
