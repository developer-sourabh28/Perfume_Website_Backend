const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    itemId : {type: Schema.Types.ObjectId, ref : 'Item', required: true},
    itemName : {type : String, required : true},
    itemPrice : {type : String, required : true},
    itemSize : {type : String, required : true},
    itemType : {type : String, required : true},
});


module.exports = mongoose.model('Cart', cartSchema);