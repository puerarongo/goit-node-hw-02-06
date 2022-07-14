const User = require("../models/user");
const createError = require("http-errors");
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
        const data = await User.create({ email, password: hashPassword });
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

module.exports = {
    registration,
    login,
    logout,
    current
};