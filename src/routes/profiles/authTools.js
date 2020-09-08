const jwt = require("jsonwebtoken") ;
const facebookModel = require("./facebookSchema");
const passport = require("passport");
const facebookStrategy = require("passport-facebook").Strategy;

const authenticate = async (user) => {
  try {
    // generate tokens
    const newAccessToken = await generateJWT({ _id: user._id }) ;
    await user.save() ;
    return { token: newAccessToken } ;
  } catch (error) {
    console.log(error) ;
    throw new Error(error) ;
  }
} ;

const generateJWT = (payload) =>
  new Promise((res, rej) =>
    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      { expiresIn: "5m" },
      (err, token) => {
        if (err) rej(err) ;
        res(token) ;
      }
    )
  ) ;

const verifyJWT = (token) =>
  new Promise((res, rej) =>
    jwt.verify(token,  process.env.SECRET_KEY, (err, decoded) => {
      if (err) rej(err) ;
      res(decoded) ;
    })
  ) ;

  passport.use(
    new facebookStrategy({
    clientID: '342521156896557',
    clientSecret: 'e5f8413e7a2c47be5951c6577905109b',
    callbackURL: "http://localhost:3004/profile/facebook/",
    profileFields: ['id', 'displayName', 'first_name', 'last_name'],
    enableProof: true
  },
  async (request, accessToken, refreshToken, profile, done) => {
    const newUser = {
      facebookId: profile.id,
      username:profile.username,
      name: profile.name.givenName,
      middleName : profile.name.middleName,
      gender:profile.gender,
      surname: profile.name.familyName,
    //   email: profile.emails[0].value,
    
    };   
    try {
      const user = await facebookModel.findOne({ facebookId: profile.id });
      if (user) {
        const tokens = await authenticate(user);
        done(null, { user, tokens });
      } else {
        let createdUser = await facebookModel.create(newUser);
        const tokens = await authenticate(createdUser);
        done(null, { user, tokens });
      }
    } catch (error) {
      console.log(error);
      done(error);
    }
  }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});
  
passport.deserializeUser(function (user, done) {
    done(null, user);
});




module.exports = { authenticate, verifyJWT};

