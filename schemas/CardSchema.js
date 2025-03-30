const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = new Schema({
    image:{
        type : String,
        required : true,
    },
    name:{
       type : String,
       required : true,
    },
    description:{
        type : String,
        required : true,
     },
     profile:{
        type : String,
        required : true,
     },
})

module.exports = mongoose.model('card', CardSchema);