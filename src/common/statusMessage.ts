// export const MESSAGE = {
//     CREATE_MESSAGE: " created successfully",
//     UPDATE_MESSAGE: " updated successfully",
//     NOT_UPDATE_MESSAGE: " Not updated",
//     DELETE_MESSAGE: "Deleted successfully",
//     EMAIL_MESSAGE: "Thanking you for contact us!"
// };

export const STATUS_CODE = {

    EC202: 202, //Record Exits
    EC200: 200, //Success
    EC500: 500, //Internal server error

    EC201: 201, //Record Created

    EC100: 100, //Continue
    EC401: 401, //Unauthorized
    EC403: 403,
    EC409: 409, //Conflict
    EC400: 400, //Bad Request
    EC204: 204, //No content
    EC422: 422, //Unprocessable Content
    EC402: 422, //Payment Failed
    EC419: 419, //Payment Failed
    EC410: 410,
};

export const RES_STATUS = {
    E1: true,
    E2: false
};
export const RES_MESSAGE = {
    EM202: 'Data Exits...',
    EM207: 'Email Or Mobile Already Exists...',
    EM201: 'Data Create Successfully',
    EM500: 'Something went wrong !! please try again later',
    EM206 : 'Password Not Metch...',
    EM12: 'Invalid token',
    EM212: 'User Not Exits...',
    EM102 : 'User Is Loginned Another Device...',
    EM200: 'Data Fetched Successfully',
    EM410: 'Data Not Found',
    EM208: 'Data Update Successfully',
    EM210: 'Data Delete Successfully',
    EM204: 'Token Not Found!',
    EM11: 'Token expired Try Again!',
    EM10: 'Token Is Matched',

    
    EM400: 'Bad Request',
    EM422: 'Unprocessable Content',
    EM402: 'Payment Failed',
    EM403: 'Your payment is successfully done. You order is in process.',
    EM404: 'Your payment is Already successfully done.',
    EM409: 'File Not Uploaded. Try Again!',
    EM531: 'OTP Sent Successfully',
    EM533: 'OTP Invalid',

};

export const EMPTY_RESPONSE = {
    "data": {},
    "status": false,
    "message": "Data not found"
};

// export const FILE_TYPE = {
//     PNG: 'image/png',
//     JPG: 'image/jpg',
//     JPEG: 'image/jpeg',
//     GIF: 'image/gif',
//     PDF: 'application/pdf',
// }