const { model, Schema } = require("mongoose");
const profileModel = require('../profiles/schema')

const experiencesSchema = new Schema(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date }, //could be null
    description: { type: String, required: true },
    area: { type: String, required: true },
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
    image: { type: String, required: true },
  },
  { timestamps: true }
);

const expModel = model("experiences", experiencesSchema);

module.exports = expModel;
