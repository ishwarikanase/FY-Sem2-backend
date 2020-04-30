const mongoose=require('mongoose');

var expense=mongoose.Schema({
    payerId:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    consumerId:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    consumerExpense:{type:Number},
    totalAmount:{type:Number},
    description:{type:String},
    date:{type:Number,default:Date.now()},
    createdAt:{type:Number,default:Date.now()},
});
module.exports = mongoose.model('Expense', expense);
