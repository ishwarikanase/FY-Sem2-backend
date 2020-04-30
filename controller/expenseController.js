const User = require('../models/user');
const Expense = require('../models/expense');
const mongoose = require('mongoose');
const activityHelper = require('./activityHelper');
const config = require('../config/config');



module.exports = {
    addExpense: (req, res) => {
        var expense = new Expense(req.body);
        console.log(expense);
        User.findById(req.decoded.userId, (foundErr, foundUser) => {
            if (foundErr) {
                res.status(500).json({ success: false, error: foundErr });
            }
            else {
                if (foundUser) {
                    expense.save((saveErr, newExpense) => {
                        if (saveErr) {
                            res.status(500).json({ success: false, error: saveErr });
                        }
                        else {
                            let upObj = foundUser.friendsExpense.find(ele => ele.id.toString() === expense.consumerId.toString());
                            User.findById(expense.consumerId, (foundCErr, ConsumerUser) => {
                                if (foundCErr) {
                                    res.status(500).json({ success: false, error: foundCErr });

                                } else {
                                    if (ConsumerUser) {
                                        let upObj1 = ConsumerUser.friendsExpense.find(ele => ele.id.toString() === expense.payerId.toString());
                                        console.log(upObj1);
                                        User.update(
                                            { '_id': foundUser._id, 'friendsExpense.id': expense.consumerId },
                                            {
                                                '$set': {
                                                    'friendsExpense.$.owe': upObj.owe + (expense.totalAmount - expense.consumerExpense)
                                                }
                                            },
                                            (err, user) => {
                                                if (err) {
                                                    res.status(500).json({ success: false, error: err });
                                                }
                                                else {
                                                    User.update(
                                                        { '_id': expense.consumerId, 'friendsExpense.id': foundUser._id },
                                                        {
                                                            '$set': {
                                                                'friendsExpense.$.owe': upObj1.owe + expense.consumerExpense - expense.totalAmount
                                                            }
                                                        },
                                                        (errU, user) => {
                                                            if (errU) {
                                                                res.status(500).json({ success: false, error: errU });
                                                            }
                                                            else {
                                                                console.log('user', user);
                                                                activityHelper.addActivities({
                                                                    category: config.expenses, activityBy: foundUser._id, activityWith: ConsumerUser._id,
                                                                    expense: { expenseDescription: expense.description, expenseDate: expense.date, totalAmount: expense.totalAmount, LoggedInOwe:  (expense.totalAmount - expense.consumerExpense) }
                                                                }, (callback) => {
                                                                    if (callback.success) {
                                                                        res.status(200).json({ success: true, activity: callback.message });
                                                                    }
                                                                    else {
                                                                        res.status(500).json({ success: false, activity: callback.message });
                                                                    }
                                                                });
                                                                // res.status(200).json({ success: true, message: "success", expense: user });
                                                            }
                                                        }
                                                    );
                                                }
                                            }
                                        );
                                    }
                                }
                            });
                        }
                    });
                }
                else {
                    res.status(500).json({ success: false, error: "not found" });
                }
            }

        });
    }
}
