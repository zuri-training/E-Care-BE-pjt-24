const express = require('express');
const router = express.Router();
const advreq = require('../models/advreq');
const advreqCtrl = require('../controller/advController');

router.post('/advreq',advreqCtrl.advReq);
router.get('/viewadvice/:id',advreqCtrl.advView)

module.exports = router;