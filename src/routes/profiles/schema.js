const { model, Schema } = require("mongoose");

const profileSchema = new Schema({
    
    name: {type:String, required:true},
    surname: {type:String, required:true},
    email: {type:String, required:true}, //VALIDATION
    bio: {type:String, required:true},
    title: {type:String, required:true},
    area: {type:String, required:true},
    image: {type:String, required:true},
    username: {type:String, required:true} //validaton
    
},{timestamps:true});

const profileModel = model("profiles", profileSchema);




module.exports = profileModel;