const express = require('express');
const router = express.Router();

router.post('/register');
router.post('/login');
router.post('/logout');

router.get('/profile');
router.put('/profile');

module.exports = router;