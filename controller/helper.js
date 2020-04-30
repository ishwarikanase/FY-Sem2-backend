const User = require('../models/user');

var addToFriendList = function (myUserId, friendUser, callback) {
    User.findById(myUserId, (err, foundUser) => {
        if (err) {
            res.status(500).json({ success: false });
        }
        else if (foundUser) {
            if (foundUser.friends.includes(friendUser._id)) {
                callback({ success: false, message: "you are already friends." });
            }
            else {
                foundUser.friends.push(friendUser._id);
                foundUser.friendsExpense.push({ id: friendUser._id, owe: 0 });
                foundUser.save((svErr) => {
                    if (svErr) {
                        callback({ success: false, message: "Error adding friend" });
                    } else {
                        if (friendUser.friends.includes(myUserId)) {
                            callback({ success: false, message: "you are already friends." });
                        } else {
                            friendUser.friends.push(myUserId);
                            friendUser.friendsExpense.push({ id: myUserId, owe: 0 });
                            friendUser.save((fsvErr) => {
                                if (fsvErr) {
                                    callback({ success: false, message: "Error adding friend" });
                                } else {
                                    callback({ success: true, message: "you are friends now!!!" });
                                }
                            })
                        }
                    }
                })


            }
        }
    })


}

module.exports.addToFriendList = addToFriendList;