const express = require("express");
const router = express.Router();
const profileModel = require('../profiles/schema')
const experienceModel = require("../experiences/schema")
const path = require("path")
const fs = require("fs")
const PdfPrinter = require('pdfmake')
const pdfPath = path.join(__dirname , '../../../public/pdf') 
router.get("/:username", async (req, res, next) => {
    try {
      let profile = await profileModel.find({username:req.params.username})
      const experience = await experienceModel.find({username:req.params.username})
      let experienceObj = {
          role:"",
      }
      let company = []
      experience.map((experience)=>{
          console.log(experience.role)
   })
   console.log(experience.role)
        // var fonts = {
        //     Roboto: {
        //         normal: 'node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.ttf',
        //         bold: 'node_modules/roboto-font/fonts/Roboto/roboto-bold-webfont.ttf',
        //         italics: 'node_modules/roboto-font/fonts/Roboto/roboto-italic-webfont.ttf',
        //         bolditalics: 'node_modules/roboto-font/fonts/Roboto/roboto-bolditalic-webfont.ttf'
        //     }
        // };
        // let printer = new PdfPrinter(fonts)
        // let doc = {
        //     pageMargins: [150, 50, 150, 50],
        //     content: [
        //         { text: `Welcome ${cv[0].name}`, fontSize: 25, background: 'yellow', italics: true },
        //         "PROFILE DETAILS                                                                    ",
        //         `Name:${cv[0].name} ${cv[0].surname}`,
        //         `Email:${cv[0].email}`,
        //         `Biography:${cv[0].bio}`,
        //         `Title:${cv[0].title}`,
        //         `Area:${cv[0].area}`,
        //         'I hope you will have fun, and dont forget to get drunk!',
        //         "EXPERIENCE DETAILS",
        //         `Company:${cv[1].role}`,
        //         `Description:${cv[1].description}`,
        //         `Area:${cv[1].area}`  
        //     ]
        // }
        // var pdfDoc = printer.createPdfKitDocument(doc);
        //  await pdfDoc.pipe(fs.createWriteStream(path.join(pdfPath,`${cv[0]._id}.pdf`)))
        // pdfDoc.end()
        // res.send("PDF CREATED")
    } catch (error) {
      next(error)
    }
  });

module.exports = router