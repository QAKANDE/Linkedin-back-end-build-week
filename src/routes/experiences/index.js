const express = require("express");
const router = express.Router();
// const {Transform} = require("json2csv")
const multer = require("multer");
const upload = multer();
const { join } = require("path");
const { readdir, writeFile } = require("fs-extra");
const experienceModel = require("./schema");

router.get("/:username", async (req, res, next) => {
  try {
    const response = await experienceModel.find({
      username: req.params.username,
    });
    if (response.length) {
      res.send(response);
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      throw error;
    }
  } catch (error) {
    next(error);
  }
});

router.get("/:username/:id", async (req, res) => {
  try {
    const response = await experienceModel.find({
      username: req.params.username,
      _id:req.params.id
    });
    if (response) {
      res.send(response);
    } else {
   res.send("Error occurred")
    }
  } catch (error) {
    next(error);
  }
});



router.post(
  "/image/:id",
  upload.single("experience"),
  async (req, res, next) => {
    try {
      const imgDir = join(
        __dirname,
        `../../../public/experienceImages/${req.params.id + req.file.originalname}`
      );
      await writeFile(imgDir, req.file.buffer);
      const editExperience = await experienceModel.findByIdAndUpdate(
        req.params.id,
        {
          image:
            process.env.SERVER_URL +
            process.env.PORT +
            "/experienceImages/" +
            req.params.id +
            req.file.originalname,
        }
      );
      res.status(201).send(editExperience);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
);

router.post("/:username", async (req, res) => {
  try {
    const experienceBody = { ...req.body, username: req.params.username };
    const newExperience = new experienceModel(experienceBody);
    await newExperience.save();
    res.send(newExperience);
  } catch (error) {
    next(error);
  }
});


router.put("/:id", async (req, res,next) => {
  try {
    delete req.body.username
    const editExperience = await experienceModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    res.send(req.body);
  } catch (error) {
    next(error);
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const deleteExperience = await experienceModel.findByIdAndDelete(
      req.params.id
    );
    res.send("Deleted");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
