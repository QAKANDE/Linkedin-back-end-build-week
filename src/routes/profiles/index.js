const express = require("express");
const router = express.Router();
const profileModel = require("./schema");
const multer = require('multer')
const upload = multer()
const {join} = require('path')
const {readdir,writeFile} =require('fs-extra');
const cloudinary = require('cloudinary').v2



router.get("/", async (req, res, next) => {
  try {
    let user = await profileModel.find();
    
    if(user.length)
    res.send(user);
    else {
      const error= new Error()
      error.httpStatusCode=404
      next(error)
    }

  } catch (error) {
    next(error)
  }
});
router.get("/:username", async (req, res, next) => {
  try {
    let user = await profileModel.find({username:req.params.username});
    if(user){
      res.send(user[0]);
    }else{
      const error = new Error()
      error.httpStatusCode=404
      throw error
    }
    
  }catch (error) {
    next(error)
  }
});

router.post("/image/:id",upload.single('profile') ,async(req,res,next)=>{
  
  try {
    

    const imgDir = join(__dirname,`../../../public/profileImages/${req.params.id + req.file.originalname }`)
    await writeFile(imgDir,req.file.buffer)
    const imageURL= await cloudinary.uploader.upload(imgDir)
    console.log(imageURL)
    const editprofile = await profileModel.findOneAndUpdate({username:req.params.id},
      {"image": imageURL.url}
    )
    res.status(201).send(editprofile)
  } catch (err) {
    console.log(err)
    next(err)
  }
})

router.post("/", async (req, res, next) => {
  try {
    const newProfile = new profileModel(req.body);
    const response = await newProfile.save();
    res.send(newProfile);
  } catch (error) {
    next(error)
  }
});



router.put("/:id", async (req, res, next) => {
  try {
    const editprofile = await profileModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    const edited = await profileModel.findById(req.params.id);
    if(edited.length>0)
    res.send(edited);
    else {
      const error = new Error()
      error.httpStatusCode=404
      next(error)
    }
  } catch (error) {
    next(error)
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await profileModel.findByIdAndDelete(req.params.id);
    if(deleted.length)
    res.send(deleted);
    else {
      const error= new Error()
      error.httpStatusCode=404
      next(error)
    }
  } catch (error) {
    next(error)
  }
});

module.exports = router;
