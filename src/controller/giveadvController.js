const Giveadv = require('../models/giveadv');

exports.docAdv = (req,res) => {
    Giveadv.create({
        prescription:req.body.prescription,
        dosage:req.body.dosage,
        advice:req.body.advice,
        patient:req.body.patient
    },(err,advice)=>{
        if (err){
            return res.status(500).json({err})
        }else{
            return res.status(200).json({advice})
        }
    })
};


exports.advView = (req,res)=>{
    Giveadv.findById(req.params.id,(err,data)=>{
        if(err){
            return res.status(500).json({ err })
        }else{
            return res.status(200).json({ data })
        }
    })
};