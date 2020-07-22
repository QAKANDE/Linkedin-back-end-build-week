const PDFDocument = require("pdfkit");
const fs = require("fs-extra");
const {join} = require('path');
const { response } = require("express");
const { SSL_OP_CIPHER_SERVER_PREFERENCE } = require("constants");

// Create a document
//MAKE SURE THAT USER IS AN OBJECT AND EXPERIENCES IS AN ARRAY
const createPDF = (user, experiences) => {
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(join(__dirname,`../public/pdf/${user.username}.pdf`)));


  // doc.image(user.image, 320, 15, {fit: [100, 100]})
  //  .rect(320, 15, 100, 100)
  //  .stroke()
  //  .text('Fit', 320, 0)

  doc.font('Times-Roman')
   .text(`${user.name}  ${user.surname}`)
   .moveDown(0.5)
   doc.font('Times-Roman')
   .text(`${user.bio}`)
   .moveDown(0.5)
   doc.font('Times-Roman')
   .text(`${user.title}`)
   .moveDown(0.5)
   doc.font('Times-Roman')
   .text(`${user.email}`)
   .moveDown(0.5)


  experiences.map((e,i) => {
    
    doc.font('Times-Roman')
    .text(`----------------------------------------------`)
    .moveDown(0.5)
    doc.fontSize(8).text(`Role : ${e.role}`);
    doc.moveDown();
    doc.fontSize(8).text(`Company : ${e.company}`);
    doc.moveDown();
    doc.fontSize(8).text(`Area : ${e.area}`);
    doc.moveDown();
    doc.fontSize(8).text(`Start Date : ${e.startDate}`);
    doc.moveDown();
    doc.fontSize(8).text(`End Date : ${e.endDate}`);
    doc.moveDown();
    
  });

  doc.end();


};


module.exports = createPDF;