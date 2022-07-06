const Contact = require("../models/contact");
// const createError = require("http-errors");


const getContacts = async (req, res, next) => {
    try {
        const data = await Contact.find();
        res.json({ data, status: 200 });
    }
    catch (err) {
        next(err);
    }
};


// const getContact = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const data = await contacts.getContactById(id);
//         if (!data) {
//             const error = createError(404, "Not found");
//             throw error;
//         }
//         res.json({ data, status: 200 });
//     }
//     catch (err) {
//         next(err);
//     }
// };
// 
// 
const postContact = async (req, res, next) => {
    try { 
        const data = await Contact.create(req.body);
        res.json({ data, status: 201 });
    }
    catch (err) {
        if (err.message.includes("validation failed")) {
            err.status = 400;
        }
        next(err);
    }
};
// 
// 
// const deleteContact = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const data = await contacts.removeContact(id);
//         if (!data) {
//             const error = createError(404, "Not found");
//             throw error;
//         }
//         res.json({ message: "Contact deleted", status: 200 })
//     }
//     catch (err) {
//         next(err);
//     }
// };
// 
// 
// const putContact = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const { name, email, phone } = req.body;
//         const data = await contacts.updateContact(id, name, email, phone);
//         if (!data) {
//             const error = createError(404, "Not found");
//             throw error;
//         }
//         res.json({ data, status: 200 });
//     }
//     catch (err) {
//         next(err);
//     }
// };


module.exports = {
    getContacts,
//     getContact,
    postContact,
//     deleteContact,
//     putContact
};