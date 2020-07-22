// const express = require("express");
// const router = express.Router();
// const profileModel = require("../profiles/schema");
// const experienceModel = require("../experiences/schema");
// const path = require("path");
// const fs = require("fs");
// const PdfPrinter = require("pdfmake");
// const pdfPath = path.join(__dirname, "../../../public/pdf");
// const pump = require("pump");
// const { parse, Transform } = require("json2csv");
// const { join } = require("path");
// const { model } = require("../profiles/schema");
// router.get("/csv/:username", async (req, res, next) => {
//   try {
//     const fields = [
//       "role",
//       "company",
//       "startDate",
//       "endDate",
//       "description",
//       "area",
//     ];
//     const transformOpts = { highWaterMark: 16384, encoding: "utf-8" };
//     const outputPath = join(__dirname, `../../../public/csv/output.csv`);
//     const inputPath = join(__dirname, "../../../public/csv/admin.json");
//     const experiences = await experienceModel.find({
//       username: req.params.username,
//     });
//     // fs.writeFileSync(inputPath, JSON.stringify(experiences));
//    // const input = fs.createReadStream(inputPath);
//     const output = fs.createWriteStream(outputPath, { encoding: "utf8" });
//     const json2csv = new Transform(experiences,{ fields }, transformOpts);
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=output.csv`)
//       json2csv.pipe(output).pipe(res)
    
//   } catch (error) {
//     next(error);
//   }
// });

// module.exports = router;
