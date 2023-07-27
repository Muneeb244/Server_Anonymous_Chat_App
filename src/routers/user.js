const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { User, validateSignup, validateSignin } = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");

//middleware
// const auth = require("../middlewares/AuthToken");


//Nodemailer function
const nodemailer = require("nodemailer");
const auth = require("../../middlewares/auth");


// function sending emails
async function mailer(email, code) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "xtyc116@gmail.com",
      pass: "jbdxjtlxlnucozza",
    },
  });

  let info = await transporter.sendMail({
    from: "Muneeb@coder.com",
    to: `${email}`,
    subject: "Signup verification",
    text: `Your verification code is: ${code}`,
    html: `<b>Your verification code is: <h1>${code}</h1></b>`,
  });

  console.log("Message sent: %s", info.messageId);
}


router.post("/verify", async (req, res) => {
  const { error } = validateSignup(req.body);
  if (error) return res.status(422).json(error.details[0].message);

  const duplicate = await User.findOne({ email: req.body.email });
  if (duplicate) return res.status(400).json("user already exists");

  try {
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    req.body.verificationCode = verificationCode;
    await mailer(req.body.email, verificationCode);
    res.json({message: "Verification code sent to your email", user: req.body});

  } catch (error) {
    console.log(error);
  }
});

router.get("/", auth, async (req, res) => {
  res.send(req.user);
});

router.post("/signup", async (req, res) => {

  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    address: req.body.address,
  });

  user = await user
    .save()
    .then(() => {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      res.json({ token });
    })
    .catch((err) => res.json(err.message));
});



router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const { error } = validateSignin(req.body);
  if (error) return res.json(error.details[0].message);

  const user = await User.findOne({ email: email });
  if (!user) return res.status(404).json("Invalid email or password");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json("Invalid email or password");

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});



module.exports = router;
