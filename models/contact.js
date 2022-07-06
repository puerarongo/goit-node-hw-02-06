const { Schema, model } = require("mongoose");


// * Schema
const contactSchema = Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
});

// * Model
// * Название первого аргумента нужно писать в единственном числе
const Contact = model("contact", contactSchema);

module.exports = Contact;