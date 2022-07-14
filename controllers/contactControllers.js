const Contact = require("../models/contact");
const createError = require("http-errors");


const getContacts = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, favorite } = req.query;
        const { _id } = req.user;

        const skip = (page - 1) * limit;
        // ? populate связывает одну колекцию с другой (contacts и users)
        let data = await Contact.find(
            { owner: _id },
            "-createdAt -updatedAt",
            { skip, limit: +limit }
        ).populate("owner", "email subscription");

        if (favorite === "true" || favorite === "false") {
            data = data.filter(elem => String(elem.favorite) === favorite)
        }
        
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
        const body = { ...req.body, owner: req.user._id };
        const data = await Contact.create(body);
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
        res.status(200).json({ message: "Contact deleted" });
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