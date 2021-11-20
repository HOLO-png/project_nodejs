const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

//REGISTER
router.post("/register", async (req, res) => {
  const {username, password, email} = req.body;

  if(!username || !password || !email) {
    return res.status(400).json({success: false, message: 'missing username, password, email!'});
  }
  try {
    const emailVld = await User.findOne({email})

    if(emailVld) {
      return res.status(400).json({success: false, message: 'email already email!'});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const accessToken = jwt.sign({userId: newUser._id}, process.env.ACCESS_TOKEN_SECRET)
    res.status(200).json({success: true, message: 'user created successfully!', accessToken, user});
  } catch (err) {
    res.status(500).json({success: false, message: err})
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  const {email, password} = req.body;

  if(!email || !password) {
     return res.status(400).json({success: false, message: 'missing password and/or email!'});
  }
  try {
    const user = await User.findOne({ email });
    !user && res.status(400).json({success: false, message: 'incorrect password and/or email!'});

    const passwordVld = await bcrypt.compare(req.body.password, user.password)
    !passwordVld && res.status(400).json({success: false, message: 'incorrect password and/or email!'});

    const accessToken = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET)
    res.status(200).json({success: true, message: 'login is successfully!', accessToken, user}, );
  } catch (err) {
    res.status(500).json({success: false, message: err})
  }
});

module.exports = router;