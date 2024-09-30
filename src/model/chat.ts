import mongoose, { Schema } from 'mongoose';

const chatSchema: Schema = new Schema(
  {
    _id: {
      type: String,
      required: true
    },
    sender_id: {
      type: String,
      required: true
    },
    reciver_id: {
      type: String,
      required: true
    },
    is_send: {
      type: Number,
      required: true,
      default: 0
    },
    is_recived: {
      type: Number,
      required: true,
      default: 0

    },
    is_read: {
      type: Number,
      required: true,
      default: 0

    },
    sent_time: {
      type: String,
      required: true

    },
    message: {
      type: String,
      required: true
    },
    // reciver_username: {
    //   type: String,
    //   // required: true
    // },
    // sender_username: {
    //   type: String,
    //   // required: true
    // },
    delete_me: {
      type: Number,
      required: true,
      default: 0
    },
    edited: {
      type: Number,
      required: true,
      default: 0
    },
    delete_everyone: {
      type: Number,
      required: true,
      default: 0
    },
  },
  { timestamps: true }
);

export default mongoose.model('Chat', chatSchema);
