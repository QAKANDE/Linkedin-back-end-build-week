const express = require("express");
const router = express.Router();
const profileModel = require('../profiles/schema')
const experienceModel = require("../experiences/schema")
const path = require("path")
const fs = require("fs")
const pump = require("pump")
const jsonexport = require("jsonexport")
const {Transform} = require("json2csv")
const PdfPrinter = require('pdfmake')
const PDFDocument = require('pdfkit');
const pdfPath = path.join(__dirname , '../../../public/pdf') 
const csvPath = path.join(__dirname , '../../../public/csv/ex.csv') 
const cvPath = path.join(__dirname , '../../../public/csv/cv.json') 
router.get("/:username", async (req, res, next) => {
    try {
      let profile = await profileModel.find({username:req.params.username})
      let experience = await experienceModel.find({username:req.params.username})
        var fonts = {
            Roboto: {
                normal: 'node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.ttf',
                bold: 'node_modules/roboto-font/fonts/Roboto/roboto-bold-webfont.ttf',
                italics: 'node_modules/roboto-font/fonts/Roboto/roboto-italic-webfont.ttf',
                bolditalics: 'node_modules/roboto-font/fonts/Roboto/roboto-bolditalic-webfont.ttf'
            }
        };
        // const both = []

        // profile.map((ele)=>{
        //     both.push(ele)
        // })
        //     experience.map((ele)=>{
        //                 both.push(ele)
        //             })
        // both.map((ele)=> {
        //     console.log("ELEMENT:",ele)
        // })
        profile[0].experiences = []
        experience.map((ele)=>{
            profile[0].experiences.push(ele)
        })
        experience.map((ele)=>{
            const ex = {
                role:[ele.role],
                company:[ele.company]
            }
            console.log(ex)
        })
        let printer = new PdfPrinter(fonts)
            let doc = {
                pageMargins: [150, 50, 150, 50],
                content: [
                    { text: `Welcome ${profile[0].name}`, fontSize: 25, background: 'yellow', italics: true },
                    "PROFILE DETAILS                                                                    ",
                    `Name:${profile[0].name} ${profile[0].surname}`,
                    `Email:${profile[0].email}`,
                    `Biography:${profile[0].bio}`,
                    `Title:${profile[0].title}`,
                    `Area:${profile[0].area}`,
                    experience.map((ele)=> {
                    "EXPERIENCE DETAILS",
                        `ROLE:${ele.role}     COMPANY:${ele.company}`,
                        `Description:${ele.description}`,
                        `START DATE:${ele.startDate}    END DATE : ${ele.endDate}`,
                        `DESCRIPTION:${ele.description}`,
                        `AREA:${ele.area}` 
                    })
                ]
            }
            var pdfDoc = printer.createPdfKitDocument(doc);
             pdfDoc.pipe(fs.createWriteStream(path.join(pdfPath,`${profile[0].name}.pdf`)))
            pdfDoc.end()
        res.send("PDF CREATED")
    } catch (error) {
      next(error)
    }
  });

  router.get('/csv/:id' , async (req,res,next)=>{
      try {
          const response = await experienceModel.findById(req.params.id)
        let cvJSON = readFile()
        //   jsonexport(response, function(err, csv){
        //     if (err) return console.error(err);
        //     console.log(csv);
        // });
          const json2csv = new Transform({
              fields: ["_id", "role", "company", "startDate", "endDate","description","area","image","username",
          "createdAt","updatedAt"]
          })
          const input = fs.createWriteStream(csvPath)
          pump(response,json2csv,output , (err)=>{
              if(err){
                  console.log(err)
              }
              else{
                  res.send("ok")
              }
          })
      } catch (error) {
          console.log(error)
      }
})

// router.get("/:username", async (req, res, next) => {
//     let profile = await profileModel.find({username:req.params.username})
//     let experience = await experienceModel.find({username:req.params.username})
//     profile[0].experiences = []
//             experience.map((ele)=>{
//                  profile[0].experiences.push(ele)
//              })
//     const doc = new PDFDocument();
//     doc.pipe(fs.createWriteStream(path.join(pdfPath,`${profile[0]._id}.pdf`)))
//     experience.map((ele)=>{
//         doc
//         .fontSize(25)
//         .text(`ROLE:${ele.role}`, 100, 100);
//     })
//     doc.end();
//     res.send("ok")
// })

module.exports = router

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

