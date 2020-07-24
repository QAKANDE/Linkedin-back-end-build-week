const express = require("express");
const router = express.Router();
const commentModel = require("./schema");
const commentsModel = require("./schema");

router.get("/", async (req, res, next) => {
  try {
    let comment = await commentsModel.find();
    
    if(comment.length)
    res.send(comment);
    else {
      const error= new Error()
      error.httpStatusCode=404
      next(error)
    }

  } catch (error) {
    next(error)
  }
});
router.get("/:postId", async (req, res, next) => {
  try {
    let comment = await commentsModel.find({postId:req.params.postId});
    if(comment){
      res.send(comment[0]);
    }else{
      const error = new Error()
      error.httpStatusCode=404
      throw error
    }
    
  }catch (error) {
    next(error)
  }
});


router.post("/", async (req, res, next) => {
  try {
    const newComment = new commentsModel(req.body);
    const response = await newComment.save();
    res.send(newComment);
  } catch (error) {
    next(error)
  }
});



router.put("/:postId", async (req, res, next) => {
  try {
    const editComment = await commentsModel.findAndUpdate(
      req.params.postId,
      req.body
    );
    const edited = await commentsModel.findById(req.params.postId);
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
    const deleted = await commentsModel.findAndDelete(req.params.postId);
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
