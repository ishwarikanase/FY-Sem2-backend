const jwt = require('jsonwebtoken');
const config = require('../config/config');
var decodeToken = (req, res, next) => {
    let token = req.headers['authorization'];
    if (token) {
        // console.log(token);
        jwt.verify(token, config.secret, (err, decodedData) => {
            if (err) {
                res.status(500).json({ success: false, message: "token expired" });
            }
            else {
                req.decoded=decodedData;
                next();                
            }
        })
    } else {
        res.status(401).json({ success: false, message: 'token not provided' });
    }
}

module.exports=decodeToken;