const User = require("../models/user");
const createError = require("http-errors");

const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs").promises;
const avatarsDirectory = require("../service/avatarsPath");
const { v4: uuidv4 } = require('uuid');

const { passwordGeneration, passwordCompare } = require("../service/passwordGeneration");
const { tokenGeneration }  = require("../service/tokenGeneration");


const registration = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            const error = createError(409, "Email in use");
            throw error;
        }

        const hashPassword = await passwordGeneration(password);
        const avatarURL = gravatar.url(email);

        const data = await User.create({ email, avatarURL, password: hashPassword });
        res.status(201).json({
            user: {
                email,
                subscription: data.subscription
            }
        });
    }
    catch (err) {
        next(err);
    }
};


const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            const error = createError(401, "Email or password is wrong");
            throw error;
        }

        const compareResult = await passwordCompare(password, user.password);
        if (!compareResult) {
            const error = createError(401, "Email or password is wrong");
            throw error;
        }
        
        const payload = { id: user._id };
        const token = tokenGeneration(payload);
        await User.findByIdAndUpdate(user._id, { token });

        res.status(200).json({
            token,
            user: {
                email,
                password
            }
        })
        
    }
    catch (err) {
        next(err);
    }
};


const logout = async (req, res, next) => { 
    try {
        const { _id } = req.user;
        await User.findByIdAndUpdate(_id, { token: null });
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
};


const current = async (req, res, next) => { 
    const { email, subscription } = req.user;
    res.status(200).json({ email, subscription });
};


const patchSubscription = async (req, res, next) => {
    try {
        const { _id } = req.user;
        const data = await User.findByIdAndUpdate(_id, req.body, { new: true });
        const { email, subscription } = data;
        res.status(200).json({ email, subscription });
    }
    catch (err) {
        next(err);
    }
};


const patchAvatar = async (req, res, next) => {
    const { _id } = req.user;
    const { path: tempUpload, filename } = req.file;
    try {
        const [extension] = filename.split(".").reverse();
        const newFilename = `avatar${uuidv4()}.${extension}`;

        const resultUpload = path.join(avatarsDirectory, newFilename);
        await fs.rename(tempUpload, resultUpload);
        
        const avatarURL = path.join("avatars", newFilename);
        await User.findByIdAndUpdate(_id, { avatarURL } );
        res.status(200).json({ avatarURL });
    }    
    catch (err) {
        next(err);
    }
};

module.exports = {
    registration,
    login,
    logout,
    current,
    patchSubscription,
    patchAvatar
};