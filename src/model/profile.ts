import mongoose, { Schema } from 'mongoose';

const profileSchema:Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'Register' },
    profile_pic: {
      type: String,
      require: true,
    },

    username : {
      type: String,
      require: true
    }
  },
  { timestamps: true }
);

export default  mongoose.model("Profiles", profileSchema);