const express = require('express');
const router = express.Router();

const {
  addContactsValidation,
  putContactsValidation,
  patchFavoriteValidation
} = require("../../middlewares/joiValidation/joiContactsValidation");

const {
  getContacts,
  getContact,
  postContact,
  deleteContact,
  putContact,
  patchFavorite
} = require("../../controllers/contactControllers");

const authentificate = require("../../middlewares/authentificate");


router.get('/', authentificate, getContacts);
router.get('/:id', getContact);
router.post('/', addContactsValidation, authentificate, postContact)
router.delete('/:id', authentificate, deleteContact);
router.put('/:id', putContactsValidation, putContact);
router.patch('/:id/favorite', patchFavoriteValidation, patchFavorite);

module.exports = router;


// * Обработка ошибок без http-errors:
// * const error = new Error("Not found");
// * error.status = 404;
// * throw error;