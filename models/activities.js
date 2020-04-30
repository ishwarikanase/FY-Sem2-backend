const mongoose = require('mongoose');

const activities = mongoose.Schema({
    activityBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    activityWith: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: { type: String },
    createdAt: { type: Number, default: Date.now() },
    expense: {
        expenseDescription: { type: String },
        expenseDate: { type: Number },
        totalAmount: { type: Number },
        LoggedInOwe: { type: Number },
    },
});

module.exports = mongoose.model("Activities", activities);
