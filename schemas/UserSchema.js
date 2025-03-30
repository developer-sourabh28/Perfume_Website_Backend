const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs')
const UserSchema = new Schema({
    name :{
        type : String,
        required : true,
    },
    email :{
        type : String,
        required : true,
    },
    password :{
        type : String,
        required : true,
    },
    role:{
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
});

UserSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
})

module.exports = mongoose.model('user', UserSchema);