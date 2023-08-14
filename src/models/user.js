const mongoose = require('mongoose');
const joi = require('joi');
const bcrypt = require('bcrypt');

const userScheme = new mongoose.Schema({
    emoji: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255

    },
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255

    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 255
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255

    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

userScheme.pre('save', async function(next) {
    const user = this;
    if(!user.isModified('password')) return next();
    user.password = await bcrypt.hash(user.password, 10);
    next();
})

const validateSignup = (user) => {
    const Schema = joi.object({
        emoji: joi.string().min(1).max(255).required(),
        username: joi.string().min(3).max(255).required(),
        name: joi.string().min(3).max(255).required(),
        email: joi.string().min(5).max(255).required().email(),
        password: joi.string().min(6).max(255).required(),
    })
    return Schema.validate(user);
}

const validateSignin = (user) => {
    const Schema = joi.object({
        email: joi.string().min(5).max(255).required().email(),
        password: joi.string().min(6).max(255).required(),
    })
    return Schema.validate(user);
}

const User = mongoose.model('User', userScheme);

module.exports.User = User;
module.exports.validateSignup = validateSignup;
module.exports.validateSignin = validateSignin;