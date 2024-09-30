import mongoose, { Schema } from 'mongoose';

const registerSchema:Schema = new Schema(
  {
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
    },
    is_online: {
      type: String,
      default: "0",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Register", registerSchema);
