const mongoose = require("mongoose");
const dotenv = require("dotenv");
 
 
dotenv.config();

mongoose.set("strictQuery", true);
mongoose 
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB connection Succesul!"))
  .catch((err) => console.log(err));

  
module.exports =  mongoose;   