"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _superagent = require("superagent");

var _superagent2 = _interopRequireDefault(_superagent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// {
//   totalAmount: 0
//   creditCard: {
//    cardNumber: this.cardNumber,
//    nameFromCard: this.nameFromCard,
//    validate: this.validate,
//    cvv: this.cvv,
//    brand: ''
//  }
//}

var validate = function validate(paymentData) {

  return paymentData.totalAmount && paymentData.cardNumber && paymentData.nameFromCard && paymentData.validate && paymentData.cvv && paymentData.brand;
};

var creditCardInstallments = 1;

var service = function service(paymentData) {

  return new Promise(function (resolve, reject) {

    if (!validate(paymentData)) {
      reject({
        message: "There's any payment field missing"
      });
    }

    _superagent2.default.post(process.env.CIELO_API_REQUEST + "/1/sales").send(JSON.stringify({
      "MerchantOrderId": process.env.CIELO_API_MERCHANTID,
      "Customer": {
        "Name": paymentData.nameFromCard
      },
      "Payment": {
        "Type": "CreditCard",
        "Amount": paymentData.totalAmount,
        "Installments": creditCardInstallments,
        "CreditCard": {
          "CardNumber": paymentData.cardNumber,
          "Holder": paymentData.nameFromCard,
          "ExpirationDate": paymentData.validate,
          "SecurityCode": paymentData.cvv,
          "Brand": paymentData.brand
        }
      }
    })).set('Content-Type', "application/json").set("MerchantId", process.env.CIELO_API_MERCHANTID).set("MerchantKey", process.env.CIELO_API_MERCHANTKEY).end(function (err, apiRes) {

      if (err) {
        reject({
          message: "Error at card operator transaction",
          data: err
        });
      } else {
        var transactionStatusApproved = "4";
        var transactionStatusApproved2 = "6";

        if (apiRes.body.Payment.ReturnCode != transactionStatusApproved && apiRes.body.Payment.ReturnCode != transactionStatusApproved2) {
          reject({
            message: "The transaction not worked well: " + apiRes.body.Payment.ReturnMessage,
            data: apiRes.body
          });
        } else resolve(apiRes.body);
      }
    });
  });
};

exports.default = service;
//# sourceMappingURL=cieloTransaction.js.map