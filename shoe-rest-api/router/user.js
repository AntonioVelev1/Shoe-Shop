const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// router.get('/profile');
// router.put('/profile');

module.exports = router;