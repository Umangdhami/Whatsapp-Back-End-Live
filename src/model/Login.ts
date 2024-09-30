import mongoose, { Schema } from 'mongoose';

const loginSchema: Schema = new Schema(
  {
    email: {
      type: String,
      require: true,
    },
    user_id: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    token: {
      type: String,
      require: true,
    }
  },
  { timestamps: true }
);

export default  mongoose.model("Login", loginSchema);
