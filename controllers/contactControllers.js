const Contact = require("../models/contact");
const createError = require("http-errors");


const getContacts = async (req, res, next) => {
    try {
        const data = await Contact.find();
        res.json({ data, status: 200 });
    }
    catch (err) {
        next(err);
    }
};


const getContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = await Contact.findById(id);
        if (!data) {
            const error = createError(404, "Not found");
            throw error;
        }
        res.json({ data, status: 200 });
    }
    catch (err) {
        if (err.message.includes("Cast to ObjectId failed")) {
            err.status = 404;
        }
        next(err);
    }
};


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


const deleteContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = await Contact.deleteOne({ _id: id });
        if (!data.deletedCount) {
            const error = createError(404, "Not found");
            throw error;
        }
        res.json({ message: "Contact deleted", status: 200 })
    }
    catch (err) {
        next(err);
    }
};


const putContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = await Contact.findByIdAndUpdate(id, req.body, {new: true});
        if (!data) {
            const error = createError(404, "Not found");
            throw error;
        }
        res.json({ data, status: 200 });
    }
    catch (err) {
        next(err);
    }
};

const patchFavorite = async (req, res, next) => {
    try { 
        const { id } = req.params;
        const data = await Contact.findByIdAndUpdate(id, req.body, { new: true });
        if (!data) {
            const error = createError(404, "Not found");
            throw error;
        }
        res.json({ data, status: 200 });
    }
    catch (err) {
        next(err);
    }
};




module.exports = {
    getContacts,
    getContact,
    postContact,
    deleteContact,
    putContact,
    patchFavorite
};