const User = require('../models/user');
// const Groups = require('../models/groups');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const email = require('./mail');
const helper = require('./helper');
const activityHelper = require('./activityHelper');

module.exports = {

    registerUser: (req, res) => {
        User.findOne({ email: req.body.email }, (err, foundUser) => {
            if (err) {
                res.status(500).json({ success: false, error: err });
            }
            else {
                if (foundUser && foundUser.verified) {
                    res.status(200).json({ success: false, message: "user already exist" });
                } else if (foundUser && !foundUser.verified) {
                    var updateUser = req.body;
                    updateUser.verified = true;
                    User.findByIdAndUpdate(foundUser._id, updateUser, (upErr, upUser) => {
                        if (upErr) {
                            res.status(500).json({ success: false, error: upErr });
                        } else {
                            res.status(200).json({ success: true, message: 'registration success', user: upUser });
                        }
                    })
                } else if (!foundUser) {
                    var user = new User(req.body);
                    user.verified = true;
                    user.save((err1, newUser) => {
                        if (err1) {
                            console.log('err1', err1)
                            res.status(500).json({ success: false, });
                        }
                        else {
                            if (newUser) {
                                console.log('newUser', newUser)
                                res.status(200).json({ success: true, message: 'registration success', user: newUser });
                            }
                        }
                    })
                }
            }
        })
    },

    loginUser: (req, res) => {
        var user = req.body;
        User.findOne({ email: user.email }, (err, foundUser) => {
            if (err) {
                console.error('err', err);
                res.status(500).json({ success: false, error: err });
            }
            else {
                if (foundUser) {
                    let isPasswordValid = foundUser.comparePassword(foundUser.password, req.body.password);
                    console.log('isPasswordValid', isPasswordValid);
                    if (isPasswordValid) {
                        const token = jwt.sign({ userId: foundUser._id }, config.secret, { expiresIn: '24h' });
                        delete foundUser.password;
                        res.status(200).json({ success: true, message: "login successful", token: token, user: foundUser })
                    }
                    else {
                        res.status(500).json({ success: false, message: "invalid password" });
                    }
                }
                else {
                    res.status(404).json({ success: false, message: "user not found" })
                }

            }
        })
    },

    allUser: (req, res) => {
        User.find({}, { password: 0 }).populate('friendsExpense.id').exec(function (err, docs) {
            if (err) {
                console.error('err', err);
                res.status(500).json({ success: false, message: "error" });
            }
            else {
                console.log(docs);
                res.status(200).json({ success: true, message: "got it!", users: docs });
            }
        });
    },

    userById: (req, res) => {
        User.findById(req.params.id, { password: 0 }, (err, element) => {
            if (err) {
                res.status(500).json({ success: false, message: "user not found" });
            }
            else {
                res.status(200).json({ success: true, message: "got it!", user: element });
            }
        })
    },

    getMyFriends: (req, res) => {
        User.findById(req.decoded.userId).populate('friends').exec(function (err, element) {
            if (err) {
                res.status(500).json({ success: false });
            }
            else {
                res.status(200).json({ success: true, user: element.friends });
            }
        })
    },

    getMyGroups: (req, res) => {
        User.findById(req.decoded.userId).populate({ path: 'usergroups', populate: { path: 'groupMembers' } }).exec(function (err, element) {
            if (err) {
                res.status(500).json({ success: false, error: err });
            }
            else {
                res.status(200).json({ success: true, user: element });
            }
        })
    },

    getUserProfile: (req, res) => {
        User.findById(req.decoded.userId, { password: 0 }).populate('friendsExpense.id').exec(function (err, element) {
            if (err) {
                res.status(500).json({ success: false });
            }
            else {
                res.status(200).json({ success: true, user: element });
            }
        })
    },

    inviteFriends: (req, res) => {
        var user = new User({ email: req.body.email });
        User.findOne({ email: user.email }, (err, foundUser) => {
            if (err) {
                res.status(500).json({ success: false });
            }
            else if (foundUser) {
                let friendListMail = {
                    toEmail: req.body.email,
                    subject: "first",
                    body: "You have been added to my friend list."
                }
                helper.addToFriendList(req.decoded.userId, foundUser, (callback) => {
                    if (callback.success) {
                        email.sendEmail(friendListMail, (cb) => {
                            console.log('cb.success', cb)
                            if (cb.success) {
                                activityHelper.addActivities({ category: config.all, activityBy: req.decoded.userId, activityWith: foundUser._id }, (callback) => {
                                    if (callback.success) {
                                        res.status(200).json({ success: true, activity: callback.message });
                                    }
                                    else {
                                        res.status(500).json({ success: false, activity: callback.message });
                                    }
                                });
                            } else {
                                res.status(500).json({
                                    success: false,
                                    message: cb.message
                                });
                            }
                        })
                    } else {
                        res.status(500).json({ success: false, message: callback.message });
                    }
                });

            }
            else if (!foundUser) {
                let invitMail = {
                    toEmail: req.body.email,
                    subject: "first",
                    body: "You are invited to join splitwise"
                }
                user.save((err, addedUser) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ success: false });
                    }
                    else {
                        helper.addToFriendList(req.decoded.userId, addedUser, (callback) => {
                            if (callback.success) {
                                email.sendEmail(invitMail, (cb) => {
                                    console.log('cb.success', cb)
                                    if (cb.success) {
                                        activityHelper.addActivities({ category: config.all, activityBy: req.decoded.userId, activityWith: addedUser._id }, (callback) => {
                                            if (callback.success) {
                                                res.status(200).json({ success: true, activity: callback.message });
                                            }
                                            else {
                                                res.status(500).json({ success: false, activity: callback.message });
                                            }
                                        });
                                    } else {
                                        res.status(500).json({
                                            success: false,
                                            message: cb.message
                                        });
                                    }
                                })
                            } else {
                                res.status(500).json({ success: false, message: callback.message });
                            }
                        });

                    }
                })
            }
        })
    },

}
