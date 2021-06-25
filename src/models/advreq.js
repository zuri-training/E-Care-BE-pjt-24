const mongoose = require('mongoose');

const advicereqSchema = new mongoose.Schema({
     
    username:{
        type:String,
        required: true
    },
    illness:{
        type:String,
        required: true
    },
    doctor:{
        type:String,
        required: true
    },
    date:{
        type:String,
        required: true
    }

})

module.exports = mongoose.model('Advicereq',advicereqSchema)