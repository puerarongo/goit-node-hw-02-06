const joi = require('joi');

module.exports = {
    addContactsValidation: (req, res, next) => {
        const schema = joi.object({
            name: joi.string()
                .min(2)
                .max(30)
                .required(),
            email: joi.string()
                .min(5)
                .max(50)
                .required(),
            phone: joi.string()
                .min(8)
                .max(16)
                .required(),
            favorite: joi.boolean()
                .optional()
        });

        const validationResult = schema.validate(req.body);
        if (validationResult.error) {
            console.log(validationResult.error)
            return res.status(400).json({ message: "missing required field" });
        }
        next();
    }, 

    putContactsValidation: (req, res, next) => {
        const schema = joi.object({
            name: joi.string()
                .min(2)
                .max(30)
                .optional(),
            email: joi.string()
                .min(5)
                .max(50)
                .optional(),
            phone: joi.string()
                .min(8)
                .max(16)
                .optional(),
            favorite: joi.boolean()
                .optional()
        });

        const validationResult = schema.validate(req.body);
        if (validationResult.error) {
            console.log(validationResult.error)
            return res.status(400).json({ message: "missing required field" });
        }
        next();
    },
    
    patchFavoriteValidation: (req, res, next) => {
        const schema = joi.object({
            favorite: joi.boolean().required()
        });
    
        const validationResult = schema.validate(req.body);
            if (validationResult.error) {
                console.log(validationResult.error)
                return res.status(400).json({ message: "missing required favorite field" });
            }
            next();
    },
};