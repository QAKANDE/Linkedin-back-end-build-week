const express = require("express");
const router = express.Router();
const profileModel = require("./schema");
const multer = require('multer')
const upload = multer()
const {join} = require('path')
const {readdir,writeFile} =require('fs-extra');

router.get("/", async (req, res, next) => {
  try {
    let user = await profileModel.find();
    res.send(user);
  } catch (error) {
    next(error)
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    let user = await profileModel.findById(req.params.id);
    res.send(user);
  }catch (error) {
    next(error)
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newProfile = new profileModel(req.body);
    const response = await newProfile.save();
    res.send(newProfile);
  } catch (error) {
    next(error)
  }
});

router.post("/image/:id",upload.single('profile') ,async(req,res,next)=>{
  
  try {
    
    const imgDir = join(__dirname,`../../../public/profiles/${req.params.id + req.file.originalname }`)
    await writeFile(imgDir,req.file.buffer)
    const directory = await readdir(join(__dirname,`../../../public/profiles`))
    const editprofile = await profileModel.findByIdAndUpdate(
      req.params.id,
      {"image": process.env.SERVER_URL + process.env.PORT +'/profiles/' + req.params.id + req.file.originalname}
    )
    res.status(201).send(editprofile)
  } catch (err) {
    console.log(err)
    next(err)
  }
})

router.put("/:id", async (req, res, next) => {
  try {
    const editprofile = await profileModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    const edited = await profileModel.findById(req.params.id);
    res.send(edited);
  } catch (error) {
    next(error)
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await profileModel.findByIdAndDelete(req.params.id);
    res.send(deleted);
  } catch (error) {
    next(error)
  }
});

module.exports = router;
