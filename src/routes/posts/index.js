const express = require("express");
const { writeFile } = require("fs-extra");
const { join } = require("path");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const cloudinary = require('cloudinary')
const postModel = require("./schema");
const { userInfo } = require("os");

router.get("/", async (req, res, next) => {
  try {
    const posts = await postModel.find().populate('user',['name','surname','image']);
    if(posts.length>0)
    res.send(posts);
    else {
      const error= new Error()
      error.httpStatusCode=404
      next(error)
    }
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const post = await postModel.findById(req.params.id).populate('user',['name','surname','image']);
    if(post){
      res.send(post);
    }else{
      const error =    Error()
      error.httpStatusCode=404
      throw error
    }
  } catch (error) {
    error.httpStatusCode=400;
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newPost = new postModel(req.body);
    await newPost.save();
    res.status(201).send(newPost);
  } catch (error) {
    next(error);
  }
});
router.post("/image/:id",upload.single('profile') ,async(req,res,next)=>{
  
  try {
    const imgDir = join(__dirname,`../../../public/postImages/${req.params.id + req.file.originalname }`)
    await writeFile(imgDir,req.file.buffer)
    const imageURL= await cloudinary.uploader.upload(imgDir)
    console.log(imageURL)
    const editprofile = await postModel.findOneAndUpdate({_id:req.params.id},
      {"image": imageURL.url}
    )
    res.status(201).send(editprofile)
  } catch (err) {
    console.log(err)
    next(err)
  }
})

//ADDS AN ARRAY OF IMAGES FOR POSTS
// router.post("/image/:id", upload.array("post"), async (req, res, next) => {
//   try {
//     console.log(req.files)
//     const images = [];
//     await Promise.all(
//       req.files.map(async (e) => {
//         const resolved = await writeFile(
//           join(
//             __dirname,
//             `../../../public/postImages/${req.params.id + e.originalname}`
//           ),
//           e.buffer
//         );
//         images.push(
//           process.env.SERVER_URL +
//             process.env.PORT +
//             "/postImages/" +
//             req.params.id +
//             e.originalname
//         );
//       })
//     );
//     await Promise.all(
//       images.map(async (e) => {
//         const post = await postModel.update(
//           { _id: req.params.id },
//           { $push: { images: e } }
//         );
//       })
//     );
//     const added = await postModel.findById(req.params.id);

//     res.send(added);
//   } catch (err) {
//     next(err);
//   }
// });
router.put("/:id", async (req, res, next) => {
  try {
    const editPost = await postModel.findByIdAndUpdate(req.params.id, req.body);
    await postModel.findById(req.params.id);
    res.send("Updated");
  } catch (error) {
    error.httpStatusCode=404
    next(error);
  }
});

//IT DELETES ALL THE IMAGES WITH THE URLS PROVIDED !
router.delete("/image/:id", async (req, res, next) => {
  try {
    if(Array.isArray(req.body.images)){
    await Promise.all(
      req.body.images.map(async (e) => {
        const post = await postModel.update(
          { _id: req.params.id },
          { $pull: { images: e } }
        );
      })
    );
    res.send({ status: "Deleted", deletedUrls: req.body.images })
    }
    else {
      let error= new Error()
      error.message="images field should be of type array !"
      throw error
    }
  } catch (error) {
    console.log(error)
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {

    await postModel.findByIdAndDelete(req.params.id);
    res.send("Deleted");
  } catch (error) {
    console.log(error)
    error.httpStatusCode=404
    next(error);
  }
});

module.exports = router;
