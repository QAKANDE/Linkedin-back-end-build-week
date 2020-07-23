const { model, Schema } = require("mongoose");
const profileModel = require('../profiles/schema')

const usernamee=""
const id = ""

const postSchema = new Schema(
  {
    text: { type: String },
    username: {
      type: String,
      required: true,
      validate: {
        validator: async function (username) {
          const user = await profileModel.find({ username: username });
          if (user.length > 0) {
            console.log('username:',id)
            return true;
          } else return false;
        },
        message: "Username doesn't exist",
      },
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'profiles',
      required: true,
      validate: {
        validator: async function (id) {
          const user = await profileModel.find({ _id: id });
          if (user.length > 0) {
            return true
          } else return false;
        },
        message: "Username doesn't exist",
      }
    },
    images: { type: Array, default: "http://localhost:3002/postImages/5f1986afcf82541fa4ce351bglitch.jpg" },
  },
  { timestamps: true }
);

const postModel = model("posts", postSchema);

module.exports = postModel;
