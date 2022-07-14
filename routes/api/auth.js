const express = require('express');
const router = express.Router();

const { authValidation } = require("../../middlewares/joiAuthValidation");
const {
    registration,
    login,
    logout,
    current
} = require("../../controllers/authControllers");
const authentificate = require("../../middlewares/authentificate");

router.post('/signup', authValidation, registration);
router.post('/login', authValidation, login);
router.get('/logout', authentificate, logout);
router.get('/current', authentificate, current);

module.exports = router;