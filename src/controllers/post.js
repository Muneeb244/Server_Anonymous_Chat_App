const {Post, validatePost } = require('../models/post');


const getPosts = async (req, res) => {
    const posts = await Post.find({}).sort({timestamp: -1}).populate('user', 'name emoji');
    res.json(posts);
}

const createPost = async (req, res) => {
    // const { error } = validatePost(req.body);
    // if (error) return res.status(422).json({ error: error.details[0].message });

    console.log("from createpost",req.body, req.user._id)
    let post = new Post({
        post: req.body.post,
        imageURL: req.body?.imageURL,
        user: req.user._id
    });

    post.save().then(() => {
        res.json({ message: "Post created successfully" });
    }).catch((err) => {
        res.status(400).json({ error: err.message })
    });
}

const deletePost = async (req, res) => {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json({ message: "Post deleted successfully" });
}

module.exports = { getPosts, createPost, deletePost }