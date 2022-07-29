const joi = require('joi');

module.exports = {
    repeatVerifyEmailValidation: (req, res, next) => {
        const schema = joi.object({
            email: joi.string()
                .min(5)
                .max(50)
                .required()
        });

        const validationResult = schema.validate(req.body);
        if (validationResult.error) {
            console.log(validationResult.error)
            return res.status(400).json({ message: "missing required field email" });
        }
        next();
    }
};