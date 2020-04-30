const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var user = mongoose.Schema({
    username: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    mobile: { type: Number },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    usergroups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Groups' }],
    verified: { type: Boolean, default: false },
    friendsExpense: [{
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        owe: { type: Number, default: 0 }
    }],
    createdAt: { type: Number, default: Date.now() },
});

user.pre('save', function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    else {
        bcrypt.hash(this.password, 10, (err, hash) => {
            if (err) {
                return next();
            }
            else {
                this.password = hash;
                next();
            }
        })
    }
})
// user.pre('findByIdAndUpdate', function (next) {
//     // const password = this.getUpdate().$set.password;
//     if (!this.isModified('password')) {
//         return next();
//     }
//     else {
//         bcrypt.hash(this.password, 10, (err, hash) => {
//             if (err) {
//                 return next();
//             }
//             else {
//                 this.password = hash;
//                 next();
//             }
//         })
//     }
// })

user.methods.comparePassword = (hash, password) => {
    return bcrypt.compareSync(password, hash);
}
module.exports = mongoose.model('User', user);