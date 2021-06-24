const Advicereq = require('../models/advreq');

exports.advReq = (req,res)=>{
    
    Advicereq.create({
        username:req.body.username,
        illness:req.body.illness,
        doctor:req.body.doctor,
        date:req.body.date

    },(err,advice)=>{
        console.log(advice)
        if(err){
            return res.status(500).json({ err })
        }
        advice.save((err,savedAdvice)=>{
            if(err){
                return res.status(500).json({ err})
            }else{
                return res.status(200).json({message:"advice request saved",savedAdvice})
            }
        })
    })

};

exports.viewAdvreq = (req,res)=>{
    Advicereq.findById(req.params.id,(err,data)=>{
        if(err){
            return res.status(500).json({ err })
        }else{
            return res.status(200).json({ data })
        }
    })
};


