const express = require('express');
const router = express.Router();

const checkAuthentication = require('../middleware/auth');
const authController = require('../controllers/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', checkAuthentication, authController.me);
router.post('/logout', checkAuthentication, authController.logout);
router.post('/logoutAll', checkAuthentication, authController.logoutAll);

module.exports = router;