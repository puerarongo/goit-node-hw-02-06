const User = require("../models/user");
const createError = require("http-errors");

const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs").promises;
const avatarsDirectory = require("../service/avatarsPath");
const { v4: uuidv4 } = require('uuid');

const { passwordGeneration, passwordCompare } = require("../service/passwordGeneration");
const { tokenGeneration } = require("../service/tokenGeneration");

// ? Работа с запросами на почту
const urlVereficationToken = require("../service/urlVereficationToken");
const sendMail = require("../helpers/sendMail");


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
        // ? Токен для верефикации почты
        const verificationToken = uuidv4();

        const data = await User.create({ email, password: hashPassword, avatarURL, verificationToken });

        const mail = {
            to: email,
            subject: `Confirm email`,
            html: urlVereficationToken(verificationToken)
        };
        await sendMail(mail);

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

        if (!user.verify) {
            const error = createError(401, "Email not verify");
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
        }); 
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


// ? AVATAR
const patchAvatar = async (req, res, next) => {
    const { _id } = req.user;
    const { path: tempUpload, filename } = req.file;

    try {
        const [extension] = filename.split(".").reverse();
        const newFilename = `avatar${uuidv4()}.${extension}`;

        const resultUpload = path.join(avatarsDirectory, newFilename);
        await fs.rename(tempUpload, resultUpload);
        
        const avatarURL = path.join("avatars", newFilename);
        await User.findByIdAndUpdate(_id, { avatarURL });
        res.status(200).json({ avatarURL });
    }    
    catch (err) {
        next(err);
    }
};


// ? MESSAGE FROM EMAIL
const getVerify = async (req, res, next) => {
    try {
        const { verificationToken } = req.params;
        const data = User.findOne({ verificationToken });
        if (!data) {
            const error = createError(404, "User not found");
            throw error;
        }

        await User.findOneAndUpdate(verificationToken, { verify: true, verificationToken: "" });
        res.status(200).json({ message: "Verification successful" });
    }
    catch (err) {
        next(err);
    }
};


const repeatVerify = async (req, res, next) => {
    try {
        const { email } = req.body;
        const data = await User.findOne({ email });
        const { verify, verificationToken } = data;

        if (verify) {
            const error = createError(400, "Verification has already been passed");
            throw error;
        }

        const mail = {
            to: email,
            subject: `Confirm email`,
            html: urlVereficationToken(verificationToken)
        };
        await sendMail(mail);

        res.status(200).json({ message: "Verification email sent" });
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
    patchAvatar,
    getVerify,
    repeatVerify
};