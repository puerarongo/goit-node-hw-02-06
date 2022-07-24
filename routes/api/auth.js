const express = require('express');
const router = express.Router();

const { authValidation, patchSubscriptionValidation } = require("../../middlewares/joiAuthValidation");
const {
    registration,
    login,
    logout,
    current,
    patchSubscription,
    patchAvatar
} = require("../../controllers/authControllers");
const authentificate = require("../../middlewares/authentificate");
const upload = require("../../middlewares/uploadFile");


router.post('/signup', authValidation, registration);
router.post('/login', authValidation, login);
router.get('/logout', authentificate, logout);
router.get('/current', authentificate, current);
router.patch('/', authentificate, patchSubscriptionValidation, patchSubscription);
router.patch('/avatars', authentificate, upload.single("avatar"), patchAvatar);

module.exports = router;