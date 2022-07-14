const { Schema, model } = require("mongoose");

const userSchema = Schema({
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: {
        type: String,
        default: null,
    }
}, { versionKey: false, timestamps: true} );

const User = model("user", userSchema);

module.exports = User;

// ? для регулярного выражения используют метод match (mangoose) и pattern (joi)