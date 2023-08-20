const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const asyncMidleware = require('../middlewares/asyncMidleware');


const {verify, signup, signin, getProfile , forgotPassword, resetPassword, updateUser } = require('../controllers/user');


router.get("/profile", auth, asyncMidleware(getProfile));
router.post("/verify", asyncMidleware(verify));
router.post("/signup", asyncMidleware(signup));
router.post("/signin",asyncMidleware(signin));
router.post("/forgot",asyncMidleware(forgotPassword));
router.post("/reset",asyncMidleware(resetPassword));
router.put('/update', auth, asyncMidleware(updateUser));




module.exports = router;
