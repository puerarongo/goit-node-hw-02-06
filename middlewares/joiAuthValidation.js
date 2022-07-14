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
            return res.status(400).json({ message: `${validationResult.error.message}`});
        }
        next();
    },

    
    patchSubscriptionValidation: (req, res, next) => {
        const schema = joi.object({
            subscription: joi.string()
                .valid('starter', 'pro', 'business')
                .required()
        });

        const validationResult = schema.validate(req.body);
            if (validationResult.error) {
                console.log(validationResult.error)
                if (validationResult.error.message.includes(`"subscription" must be one of`)) {
                    return res.status(400).json({ message: `${validationResult.error.message}`});
                }
                return res.status(400).json({ message: "missing required field subscription"});
            }
            next();
    }
};