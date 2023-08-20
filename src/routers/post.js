const express = require('express');
const router = express.Router();

const auth = require("../middlewares/auth");
const asyncMidleware = require('../middlewares/asyncMidleware');


const { getPosts, createPost, deletePost } = require('../controllers/post');

router.get("/", auth, asyncMidleware(getPosts));
router.post("/post", auth, asyncMidleware(createPost));
router.put('/', auth, asyncMidleware());
router.delete('/delete/:id', auth, asyncMidleware(deletePost));

module.exports = router;