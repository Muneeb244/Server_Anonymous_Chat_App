const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const asyncMidleware = require('../middlewares/asyncMidleware');


const {verify, signup, signin, checker, forgotPassword, resetPassword } = require('../controllers/user');


router.get("/", asyncMidleware(checker) );
router.post("/verify", asyncMidleware(verify));
router.post("/signup", asyncMidleware(signup));
router.post("/signin",asyncMidleware(signin));
router.post("/forgot",asyncMidleware(forgotPassword));
router.post("/reset",asyncMidleware(resetPassword));



module.exports = router;
