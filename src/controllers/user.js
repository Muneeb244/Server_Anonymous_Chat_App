const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User, validateSignup, validateSignin } = require("../models/user");


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
    from: "badaboom@texinity.com",
    to: `${email}`,
    subject: "Signup verification",
    text: `Your verification code is: ${code}`,
    html: `<b>Your verification code is: <h1>${code}</h1></b>`,
  });

  console.log("Message sent: %s", info.messageId);
}

const verificationCodeGenerator = () => Math.floor(1000 + Math.random() * 9000);


const checker = async (req, res) => {
  const user = await User.find({});
  res.json(user)
}


const verify = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const { error } = validateSignup(req.body);
  if (error) return res.status(422).json({ error: error.details[0].message });

  const duplicate = await User.findOne({ email: req.body.email });
  if (duplicate) return res.status(400).json({ error: "user already exists" });

  try {
    const verificationCode = verificationCodeGenerator();
    // req.body.verificationCode = verificationCode;
    console.log(verificationCode)
    await mailer(req.body.email, verificationCode);
    res.json({ message: "Verification code sent to your email", verificationCode });
  } catch (error) {
    console.log(error);
  }
};

const signup = async (req, res) => {

  let user = new User({
    emoji: req.body.emoji,
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  user
    .save()
    .then(() => {
      res.json({ message: "Account created successfully" });
    })
    .catch((err) => {
      console.log(err.message, "error")
      res.status(400).json({ error: err.message })
    });
}


const signin = async (req, res) => {
  const { email, password } = req.body;

  const { error } = validateSignin(req.body);
  if (error) return res.json(error.details[0].message);

  const user = await User.findOne({ email: email });
  if (!user) return res.status(404).json({ error: "Invalid email or password" });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ error: "Invalid email or password" });

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
}


const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email })
  if (!user) return res.status(404).json({ error: "User not found" })

  const verificationCode = verificationCodeGenerator();
  await mailer(req.body.email, verificationCode);
  res.json({ message: "Verification code sent to your email", verificationCode });
}


const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await User.findOneAndUpdate({ email }, { password: passwordHash }, {new: true})
  if (!user) return res.status(404).json({ error: "something went wrong" })

  res.json({ message: "Password reset successfully" })

}

const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')
  if(!user) return res.status(404).json({error: "something went wrong"})

  res.json(user)
}

const updateUser = async (req, res) => {
  const { name, username, emoji, email } = req.body;

  const user = await User.findByIdAndUpdate(req.user._id, { name, username, emoji, email }, {new: true})
  if(!user) return res.status(404).json({error: "something went wrong"})

  res.json({user, message: "Profile updated successfully"})

}


module.exports = { verify, signup, signin, checker, forgotPassword, resetPassword, getProfile, updateUser }