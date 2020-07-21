const { model, Schema } = require("mongoose");


const experiencesSchema = new Schema({

        role: {type:String, required:true},
        company: {type:String, required:true},
        startDate: {type:Date, required:true},
        endDate: {type:Date}, //could be null
        description: {type:String, required:true},
        area: {type:String, required:true},
        username: {type: Schema.Types.String,ref:"profiles", required:true},
        image: {type:String, required:true},
    
},{timestamps:true});

const expModel = model('experiences', experiencesSchema);


module.exports = expModel;