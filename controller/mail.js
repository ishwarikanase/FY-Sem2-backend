const nodemailer = require('nodemailer');
const SENDGRID_USERNAME = "ishwari.kanase";
const SENDGRID_PASSWORD = "Ishwari@55";
const FROM_EMAIL = "no-reply@gmail.com";

var sendEmail = function (mailData,callback) {
    var transporter = nodemailer.createTransport({
        service: 'Sendgrid',
        auth: {
            user: SENDGRID_USERNAME,
            pass: SENDGRID_PASSWORD
        }
    });
    var mailOptions = {
        from: FROM_EMAIL,
        to: mailData.toEmail,
        subject: mailData.subject,
        text: mailData.body
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            callback({ success: false, message: err });
        } else {
            callback({ success: true, message: 'Mail has been sent.' });
        }
    });
}

module.exports.sendEmail = sendEmail
    
