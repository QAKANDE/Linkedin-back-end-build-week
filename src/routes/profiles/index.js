const express = require("express");
const router = express.Router();
const profileModel = require("./schema");

router.get("/", async (req, res, next) => {
  try {
    let user = await profileModel.find();
    res.send(user);
  } catch (error) {
    console.log(error);
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    let user = await profileModel.findById(req.params.id);
    res.send(user);
  } catch (error) {
    console.log(error);
  }
});

