const router = require("express").Router();
const User = require('../models/User');
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');
 

//* Register
router.post('/register', async (req, res) => {

  const { username, email, password, isAdmin } = req.body;

    const newUser = new User({ 
      username,
      email,
      password: CryptoJS.AES.encrypt(req.body.password, process.env.PSW_SECRET),
      isAdmin,
    });

 try {
     const savedUser = await newUser.save();
     console.log(savedUser);
     res.status(201).json(savedUser);
 } catch (error) {
    console.error(error);
    res.status(500).json(error);
 };

});

//* Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    }); 
    if(!user) res.status(401).json("Wrong Credentials");

    const hashedPassword = CryptoJS.AES.decrypt(
       user.password,
       process.env.PSW_SECRET
        );
    const Originalpassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if(Originalpassword !== req.body.password) res.status(401).json("Wrong Credentials");
 
  const accessToken = jwt.sign({
    id: user.id,
    isAdmin: user.isAdmin
  }, process.env.JWT_SECRET,
  {expiresIn: "1d"});
 
   const { password, ...others} = user._doc;

    res.status(200).json({...others, accessToken});
  } catch (error) {
    console.status(500).json(error);
  } 
});



module.exports = router;
 