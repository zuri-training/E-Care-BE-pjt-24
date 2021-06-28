var express = require('express');
var router = express.Router();
const ObjectID = require('mongodb').ObjectID;

 

router.get('/appointment', (req, res, next) => {
  req.collection.find({})
  .toArray()
  .then(result => res.json(result))
  .catch(error => res.send(error));
});

router.post('/appointment', (req, res, next) => {
  const {time, date, doctor, reason} = req.body;
  if(!time||!date||!doctor||!reason) {
    return res.status(400).json({
      message : 'appointment time, date, doctor, reason are required'
    })
  }
  const payload = { time, date, doctor, reason };
  req.collection.insertOne(payload)
  .then(result => res.json(result))
  .catch(error => res.send(error));
});

router.delete('/appointment/:id', (req, res, next) => {
  const { id } = req.params;
  const _id = ObjectID( id.trim() );

  req.collection.deleteOne({_id })
  .then(result => res.json(result.ops[0]))
  .catch(error => res.send(error));
});


module.exports = router;
