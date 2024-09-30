import { RequestHandler } from "express";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { sanitize } from "class-sanitizer";
import { RES_MESSAGE, RES_STATUS, STATUS_CODE } from '../common/statusMessage';

function dtoValidationMiddleware<T>(type: new () => T, skipMissingProperties = false): RequestHandler {
    return async (req, res, next) => {
        try {
            // Determine the source of data
            const request = Object.keys(req.body).length > 0 ? req.body : 
                            Object.keys(req.query).length > 0 ? req.query : req.params;

            // Transform and validate
            const dtoObj: any = plainToInstance(type, request);
            const errors: ValidationError[] = await validate(dtoObj, { skipMissingProperties });

            if (errors.length > 0) {
                const dtoErrors = errors
                    .map((error: ValidationError) => Object.values(error.constraints || {}).join(", "))
                    .join(", ");
                
                return res.status(STATUS_CODE.EC400).json({
                    statusCode: STATUS_CODE.EC400,
                    status: RES_STATUS.E2,
                    message: dtoErrors,
                    data: null,
                    error: RES_MESSAGE.EM400
                });
            }

            // Sanitize and proceed
            sanitize(dtoObj);
            req.body = dtoObj;
            next();
        } catch (error: any) {
            next(res.status(STATUS_CODE.EC500).json({
                statusCode: STATUS_CODE.EC500,
                data: null,
                status: RES_STATUS.E1,
                message: RES_MESSAGE.EM500,
                error: error.message
            }));
        }
    };
}

export default dtoValidationMiddleware;
