const express = require('express');
const router = express.Router();
const Giveadv = require('../models/givedv');
const giveadvCtrl = require('../controller/giveadvController')


router.post('/giveadvice',giveadvCtrl.docAdv)
router.get('/viewadvice/:id',giveadvCtrl.advView)

module.exports = router