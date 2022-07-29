const express = require('express');
const router = express.Router();

const {
    authValidation,
    patchSubscriptionValidation
} = require("../../middlewares/joiValidation/joiAuthValidation");
const { repeatVerifyEmailValidation } = require("../../middlewares/joiValidation/joiVerifyEmailValidation");

const {
    registration,
    login,
    logout,
    current,
    patchSubscription,
    patchAvatar,
    getVerify,
    repeatVerify
} = require("../../controllers/authControllers");

const authentificate = require("../../middlewares/authentificate");
const upload = require("../../middlewares/uploadFile");


router.post('/signup', authValidation, registration);
router.post('/login', authValidation, login);
router.get('/logout', authentificate, logout);
router.get('/current', authentificate, current);
router.patch('/', authentificate, patchSubscriptionValidation, patchSubscription);
// ? AVATARS
router.patch('/avatars', authentificate, upload.single("avatar"), patchAvatar);
// ? MESSAGE FROM EMAIL
router.get('/verify/:verificationToken', getVerify);
router.post('/verify', repeatVerifyEmailValidation, repeatVerify);

module.exports = router;