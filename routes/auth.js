const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const newUser = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SEC_KEY
    ).toString(),
  });
  try {
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(401).json("Incorrect username or password!");

    // console.log(user)

    const bytes = CryptoJS.AES.decrypt(user.password, process.env.SEC_KEY);
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

    originalPassword !== req.body.password && res.status(401).json("Incorrect username or password!");


    const accessToken = jwt.sign(
      { email: user._id, isAdmin: user.isAdmin },
      process.env.SEC_KEY,
      { expiresIn: "2d" }
    );

    const { password, ...info } = user._doc;

    res.status(200).json({...info,accessToken});
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
