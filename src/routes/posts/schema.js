const { model, Schema } = require("mongoose");
const profileModel = require('../profiles/schema')

const postSchema = new Schema(
  {
    text: { type: String },
    username: {
      type: Schema.Types.String,
      ref: "profiles",
      required: true,
      validate: {
        validator: async function (username) {
          const user = await profileModel.find({ username: username });
          if (user.length > 0) {
            return true;
          } else return false;
        },
        message: "Username doesn't exist",
      },
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "profile",
      required: true,
      validate: {
        validator: async function (id) {
          const user = await profileModel.find({ _id: id });
          if (user.length > 0) {
            return true
          } else return false;
        },
        message: "Username doesn't exist",
      },
    },
    images: { type: Array, default: "www.www.www" },
  },
  { timestamps: true }
);

const postModel = model("posts", postSchema);

module.exports = postModel;
