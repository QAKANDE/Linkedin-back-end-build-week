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
router.post("/", async (req, res, next) => {
    try {
      const newProduct = new profileModel(req.body);
      const response = await newProduct.save();
      res.send(response);
    } catch (error) {}
  });

module.exports=router