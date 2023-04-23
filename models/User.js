const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password : {type : String, required : true},
  profilePic : {type : String, default : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"},
  isAdmin : { type : Boolean,default : false}
},{
    timestamps : true
});

module.exports = mongoose.model("User",UserSchema);
