const express = require("express");
const router = express.Router();
const profileModel = require("./schema");
const facebookModel = require("./facebookSchema")
const { authenticate, refreshToken } = require("./authTools");
const { authorize } = require("../../services/middlewares/authorizeUser");
const passport = require("passport");


router.post("/register", async (req, res, next) => {
  try {
    const newUser = new profileModel(req.body) ;
    const { _id } = await newUser.save() ;

    res.status(201).send(_id) ;
  } catch (error) {
    next(error) ;
  }
}) ;

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body ;

    const user = await profileModel.findByCredentials(email, password) ;
    const tokens = await authenticate(user) ;
    if(user){
      res.send(tokens) ;
    }
  } catch (error) {
 next(error) ;
  }
}) ;
router.get("/", async (req, res, next) => {
  try {
    let user = await profileModel.find();
    res.send(user);
  } catch (error) {
    console.log(error);
  }
});
router.get("/email", authorize, async (req, res, next) => {
  try { 
    let user = await profileModel.find({email : req.body.email});
    res.send(user);
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newProfile = new profileModel(req.body);
    const response = await newProfile.save();
    res.send(response);
  } catch (error) {
    res.send(error.message);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const editprofile = await profileModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    const edited = await profileModel.findById(req.params.id);
    res.send(edited);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await profileModel.findByIdAndDelete(req.params.id);
    res.send(deleted);
  } catch (error) {
    console.log(error);
  }
});

router.get('/facebookLogin',           
  passport.authenticate("facebook")
 );
 
  router.get('/facebook',
  passport.authenticate('facebook', { failureRedirect: '/profile/register' }),
  async (req, res) => {
    try {
      const { token } = req.user.tokens;
      res.cookie("accessToken", token, { httpOnly: true });
    //  const id = facebookModel.findById({_id: })
      res.status(200).redirect("http://localhost:3004/profile");
    } catch (error) {
      console.log(error);
    }
  });
module.exports = router;