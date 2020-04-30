const Activities = require('../models/activities');

var addActivities = function (body, callback) {
    var activity = new Activities(body);
    console.log(body);
    activity.save((saveErr, newActivity) => {
        if (saveErr) {
            callback({ success: false, activity: saveErr });
        } else {
            if (newActivity) {
                callback({ success: true, activity: newActivity });
            }
        }
    });
}

module.exports = {
    allActivities: (req, res) => {
        let query;
        if (req.params.category == "ALL") {
            query = {};
        } else {
            query = { category: req.params.category };
        }
        Activities.find(query).populate('activityBy').populate('activityWith').sort({_id:-1}).exec(function (allError, activity) {
            if (allError) {
                res.status(500).json({ success: false, error: allError });
            }
            else {
                res.status(200).json({ success: true, activities: activity });
            }
        });
    }
}


module.exports.addActivities = addActivities;