const express = require("express");
const router = express.Router();
const {readFile} =require('fs-extra')
const {join} = require('path')
const createPDF = require("../../createPDF");
const profileModel = require("../profiles/schema");
const experieneModel = require("../experiences/schema");

router.get("/pdf/:user", async (req, res, next) => {
  try {
    const user = await profileModel.find({ username: req.params.user });
    const experiences = await experieneModel.find({
      username: req.params.user,
    });
    //res.send(user[0].image)
    const pdf = createPDF(user[0], experiences);
     setTimeout(async () => {
        res.download(join(__dirname,`../../../public/pdf/${user[0].username}.pdf`))
    }, 3000);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
