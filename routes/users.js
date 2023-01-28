const router = require('express').Router();
const User = require('../models/User');
const {  verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
 
//* Update
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  
   const { id } = req.params;
   const { body } = req;
  
  if(req.body.password){
          req.body.password = CryptoJS.AES.encrypt(
            req.body.password, process.env.PSW_SECRET)
   };

 const existeUser = await User.findOne({
   where: {
     username: body.username, 
 
   },
 });

 if (existeUser && existeUser === body.username && existeUser.id != id) {
   return res.status(400).json({
     msg: "Already exists a username " + body.username,
   });
 }



 try {
    const updateUser = await User.findByIdAndUpdate(req.params.id, {
   $set: req.body
    }, {new: true});

 res.status(200).json(updateUser);

  } catch (error) { 
    res.status(500).json(error);
  };

});

//* Delete
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted!");
  } catch (error) {
    res.status(500).json(error);
  };
}); 
 
//* Get User
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const {password, ...others} = user._doc;

    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});
 
//* Get All Users
router.get("/", verifyTokenAndAdmin, async (req, res) => {

 const query = req.query.new

  try {
  // It gives to me the last 5 ones
    const users = query ? await User.find().sort({_id: -1}).limit(5) 
    : await User.find();
    // const {password, ...others} = users._doc;

    res.status(200).json(users); 
  } catch (error) {
    res.status(500).json(error);
  }
});
 
//* Get User Stats
router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
 const date = new Date();
 const lastYear = new Date(date.setFullYear(date.setFullYear() -1));

 try {
  const data = await User.aggregate([
    { $match: { createdAt: { $gte: lastYear } } },
    {
      $project: {
        month: { $month: "$createdAt" },
      },
    },
    {$group: {
      _id: "$month",
      total: { $sum: 1}
    }}
  ]);

  res.status(200).json(data);
 } catch (error) {
  res.status(500).json(err);
 }

});


module.exports = router; 

  