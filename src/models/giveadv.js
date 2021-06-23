const mongoose = require('mongoose');

const giveadvSchema = new mongoose.Schema({
    prescription:{
        type:String
    },

    dosage:{
        type:String
    },
    advice:{
        type:String,
        require:true
    },

    patient:{
        type:String,
        require:true
    }
});

 
module.exports = mongoose.model('Giveadv',giveadvSchema);