const express = require("express");
const router = express.Router();
// const {Transform} = require("json2csv")
const multer = require('multer')
const upload = multer()
const {join} = require('path')
const {readdir,writeFile} =require('fs-extra');
const pump = require("pump")
const experienceModel = require("./schema");

router.get('/:username', async(req,res)=>{ 
try { 
    const response = await experienceModel.find()
    res.send(response)
} catch (error) {
   console.log(error) 
}
})
router.get('/:username/:id', async(req,res)=>{
    try { 
        const response = await experienceModel.findById(req.params.id)
        res.send(response)
    } catch (error) {
       console.log(error) 
    } 
})
router.post('/:username', async(req,res)=>{
    try {
        const experienceBody = {...req.body , username:req.params.username}
        const newExperience = new experienceModel(experienceBody);
         await newExperience.save();
        res.send(newExperience);
      } catch (error) {
        console.log(error)
      }
})
router.put('/username/:id', async(req,res)=>{
    try {
        const editExperience = await experienceModel.findByIdAndUpdate(req.params.id,req.body)
        res.send(req.body)
    } catch (error) {
        console.log(error)
    }
})
router.delete('/username/:id', async(req,res)=>{
    try {
        const deleteExperience = await experienceModel.findByIdAndDelete(req.params.id)
        res.send("Deleted")
    } catch (error) {
        
    } 
})

// router.get('/:username/csv', async(req,res)=>{ 
//     try { 
//         const response = await experienceModel.find()
//         const json2csv = new Transform({
//             fields: ["_id", "role", "company", "startDate", "endDate","description","area","username",
//         "createdAt","updatedAt","image"],
//         })
//       res.sendHe
//     } catch (error) {
//        console.log(error) 
//     }
//     })
router.post("/image/:id",upload.single('experience') ,async(req,res,next)=>{
        try {
          const imgDir = join(__dirname,`../../../public/experiences/${req.params.id + req.file.originalname }`)
          await writeFile(imgDir,req.file.buffer)
          const directory = await readdir(join(__dirname,`../../../public/experiences`))
          const editExperience = await experienceModel.findByIdAndUpdate(
            req.params.id,
            {"image": process.env.SERVER_URL + process.env.PORT +'/experiences/' + req.params.id + req.file.originalname}
          )
          res.status(201).send(editExperience)
        } catch (err) {
          console.log(err)
          next(err)
        }
      })

module.exports = router