const express = require("express");
const { writeFile } = require("fs-extra");
const { join } = require("path");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const postModel = require("./schema");
const { userInfo } = require("os");

router.get("/", async (req, res, next) => {
  try {
    const posts = await postModel.find();
    res.send(posts);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const post = await postModel.findById(req.params.id);
    res.send(post);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newPost = new postModel(req.body);
    await newPost.save();
    res.status(201).send("Created");
  } catch (error) {
    next(error);
  }
});

//ADDS AN ARRAY OF IMAGES FOR POSTS
router.post("/image/:id", upload.array("post"), async (req, res, next) => {
  try {
    console.log(req.files)
    const images = [];
    await Promise.all(
      req.files.map(async (e) => {
        const resolved = await writeFile(
          join(
            __dirname,
            `../../../public/posts/${req.params.id + e.originalname}`
          ),
          e.buffer
        );
        images.push(
          process.env.SERVER_URL +
            process.env.PORT +
            "/posts/" +
            req.params.id +
            e.originalname
        );
      })
    );
    await Promise.all(
      images.map(async (e) => {
        const post = await postModel.update(
          { _id: req.params.id },
          { $push: { images: e } }
        );
      })
    );
    const added = await postModel.findById(req.params.id);

    res.send(added);
  } catch (err) {
    next(err);
  }
});
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
