const joi = require('joi');

module.exports = {
    authValidation: (req, res, next) => {
        const schema = joi.object({
            email: joi.string()
                .min(5)
                .max(50)
                .required(),
            password: joi.string()
                .min(6)
                .max(25)
                .required()
        });

        const validationResult = schema.validate(req.body);
        if (validationResult.error) {
            console.log(validationResult.error)
            return res.json({ message: `${validationResult.error}`, status: 400 });
        }
        next();
    },
};