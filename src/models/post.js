const mongoose = require('mongoose');
const joi = require('joi');

const postScheme = new mongoose.Schema({
    post: {
        type: String,
        required: [true, 'Please enter a post'],
        trim: true,
        maxlength: [500, 'Post cannot be more than 500 characters']
    },
    imageURL: {
        type: String,
        trim: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// const validatePost = (post) => {
//     const schema = joi.object({
//         post: joi.string().max(500).required(),
//     });
//     return schema.validate(post);
// }

const Post = mongoose.model('Post', postScheme);

module.exports = { Post }