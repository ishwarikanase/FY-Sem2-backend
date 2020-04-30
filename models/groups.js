const mongoose = require('mongoose');
// const User=require('./user');
const groups = mongoose.Schema({
    groupName: { type: String, required: true },
    groupMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    groupPhoto: { type: String },
    createdAt:{type:Number,default:Date.now()},
});


module.exports = mongoose.model('Groups', groups);

