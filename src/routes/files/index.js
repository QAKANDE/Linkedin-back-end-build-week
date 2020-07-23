const express = require("express");
const router = express.Router();
const { readFile, createWriteStream, unlink } = require("fs-extra");
const { join } = require("path");
const { parse, Transform } = require("json2csv");
const createPDF = require("../../createPDF");
const profileModel = require("../profiles/schema");
const experieneModel = require("../experiences/schema");
const JSONStream = require("JSONStream");
const { fstat } = require("fs");


router.get("/pdf/:user", async (req, res, next) => {
  try {
    const user = await profileModel.find({ username: req.params.user });
    const experiences = await experieneModel.find({
      username: req.params.user,
    });
    //res.send(user[0].image)
    const pdf = createPDF(user[0], experiences);
    setTimeout(async () => {
      res.download(
        join(__dirname, `../../../public/pdf/${user[0].username}.pdf`)
      );
    }, 1000);
    setTimeout(() => {
      unlink(
        join(__dirname, `../../../public/pdf/${user[0].username}.pdf`),
        () => console.log("DELETED")
      );
    }, 3000);
  } catch (error) {
    next(error);
  }
});
router.get("/csv/:username", async (req, res, next) => {
  try {
    const fields = ["role", "area", "startDate", "endDate"];
    const opts = { fields };
    const transformOpts = { highWaterMark: 16384, encoding: "utf-8" };
    const experiences = await experieneModel
      .find({
        username: req.params.username,
      })
      .stream()
      .pipe(JSONStream.stringify());
    const json2csv = new Transform(opts, transformOpts);
    const writeCSV = createWriteStream(
      join(__dirname, `../../../public/csv/${req.params.username}.csv`)
    );

    experiences.pipe(json2csv).pipe(writeCSV);
    const path = join(
      __dirname,
      `../../../public/csv/${req.params.username}.csv`
    );
    setTimeout(() => {
      res.download(path);
    }, 1000);
    setTimeout(() => {
      unlink(path, () => console.log("DELETED"));
    }, 3000);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
