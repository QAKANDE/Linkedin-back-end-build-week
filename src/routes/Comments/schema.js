const { model, Schema } = require("mongoose");

const commentSchema = new Schema(
  {
    comment: { type: String, required: true },
    commentRate: {
      type: Number,
      required: true,
    },
    postId :{
        type:Number,
        required:true
    }
  },
  { timestamps: true }
);

const commentsModel = model("comments", commentSchema);

module.exports = commentsModel;
