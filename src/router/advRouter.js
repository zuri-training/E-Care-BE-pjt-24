const express = require('express');
const router = express.Router();
const advreq = require('../models/advreq');
const advreqCtrl = require('../controller/advController');

router.post('/patient/advrequest',advreqCtrl.advReq);
router.get('/doctor/viewadvrequest',advreqCtrl.viewAdvreq);


module.exports = router;