const { model, Schema } = require("mongoose");
const bcrypt = require("bcryptjs");

const faceBookSchema = new Schema(
    {
    facebookId : String
    })

const facebookModel = model("facebook", faceBookSchema);

module.exports = facebookModel;