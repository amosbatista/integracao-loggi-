"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodemailer = require("nodemailer");

var _nodemailer2 = _interopRequireDefault(_nodemailer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var service = function service(emailTo, clientName, message) {

  return new Promise(function (resolve, reject) {

    try {

      var transporter = _nodemailer2.default.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.IS_EMAIL_SECURE, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_FROM,
          pass: process.env.EMAIL_ACCOUNT_PASSWORD
        }
      });

      var mailOptions = {
        from: "\"" + process.env.EMAIL_FROM_NAME + "\" <" + process.env.EMAIL_FROM + ">", // sender address
        to: emailTo, // list of receivers
        subject: "20º Cartório - Delivery", // Subject line
        html: "\n          <h5>Ol\xE1, " + clientName + "</h5>\n          <p>" + message + "</p>\n          <p><strong>20\xBA Cart\xF3rio</strong></p>\n        " // html body
      };

      transporter.sendMail(mailOptions).then(function (info) {
        console.log("Message sent: %s", info.messageId);
        resolve();
      }).catch(function (err) {
        reject({
          message: "Error in send e-mail to " + emailTo + ", after data set",
          data: err
        });
      });
    } catch (err) {
      reject({
        message: "Error in send e-mail to " + emailTo,
        data: err
      });
    }
  });
};

exports.default = service;
//# sourceMappingURL=email.js.map