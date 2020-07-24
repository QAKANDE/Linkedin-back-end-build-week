const express = require("express");
const listEndpoints = require("express-list-endpoints");
const profileRouter = require('./routes/profiles')
const experienceRouter = require('./routes/experiences')
const postRouter = require('./routes/posts')
const fileRoutes = require('./routes/files')
const post = require("./routes/posts")
const { join } = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const server = express();
const cloudinary = require('cloudinary').v2

cloudinary.config({ 
  cloud_name: process.env.API_CloudName, 
  api_key: process.env.API_Key, 
  api_secret: process.env.API_Secret 
})

const path=join(__dirname,'../public')
const port = process.env.PORT;

server.use(express.static(path))
server.use(cors());
server.use(express.json());
server.use('/post',postRouter)
server.use('/profile',profileRouter)
server.use('/profile/experience' , experienceRouter)
server.use('/file' , fileRoutes)
console.log(listEndpoints(server))


mongoose
  .connect(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@linkedin.7anhn.mongodb.net/linkedin-back?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(port, () => {
      console.log("Running on PORT", port);
    })
  )
  .catch((err) => console.log(err));