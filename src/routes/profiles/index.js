const express = require("express");
const router = express.Router();
const profileModel = require("./schema");

router.get('/',async (req,res,next) =>{

    try {
        let user = await profileModel.find()
    res.send(user)
    } catch (error) {
        console.log(error)
    }
    

})

module.exports=router