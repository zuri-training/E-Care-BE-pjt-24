const express = require('express');
const router = express.Router();
const giveadvCtrl = require('../controller/giveadvController')


router.post('/doctor/giveadvice',giveadvCtrl.docAdv)
router.get('/viewadvice/:id',giveadvCtrl.advView)

module.exports = router