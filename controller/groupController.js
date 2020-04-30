const Groups = require('../models/groups');
const User = require('../models/user');


module.exports = {

    createGroups: (req, res) => {
        var groups = new Groups(req.body);
        Groups.findOne({ groupName: groups.groupName }, (grfindErr, foundGroup) => {
            if (grfindErr) {
                res.status(500).json({ success: false, err: grfindErr });
            }
            else {
                if (foundGroup) {
                    res.status(500).json({ success: false, message: "group already exist" });
                }
                else if (!foundGroup) {
                    groups.save((saveErr, newGroup) => {
                        console.log(newGroup);
                        if (saveErr) {
                            res.status(500).json({ success: false, err: saveErr });
                        }
                        else {
                            if (newGroup) {
                                User.updateMany({ _id: { $in: groups.groupMembers } }, {
                                    $push: {
                                        usergroups: newGroup._id
                                    }
                                }, (updateErr, upS) => {
                                    if (updateErr) {
                                        res.status(500).json({ success: false, error: updateErr });
                                    }
                                    else {
                                        res.status(200).json({ success: true, message: "group added" });
                                    }
                                });
                                
                            }
                        }
                    })
                }
            }
        })
    },
    getGroupMembers:(req,res)=>{
        // var groups=new Groups(req.body);
        Groups.findById(req.body._id).populate('groupMembers').exec(function (err1, element1) {
            if (err1) {
                res.status(500).json({ success: false, error: err1 });
            }
            else {
                res.status(200).json({ success: true, user: element1 });
            }
        })
    }
}