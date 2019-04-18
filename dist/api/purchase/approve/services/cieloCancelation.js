'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// {
//   PaymentId,purchaseAmount

// }


var service = function service(PaymentId, purchaseAmount) {

  return new Promise(function (resolve, reject) {

    _superagent2.default.put(process.env.CIELO_API_REQUEST + ('/1/sales/' + PaymentId + '/capture')).set('Content-Type', "application/json").set("MerchantId", process.env.CIELO_API_MERCHANTID).set("MerchantKey", process.env.CIELO_API_MERCHANTKEY).end(function (err, apiRes) {

      if (err) {
        reject({
          message: "Error at card operator cancelation",
          data: err
        });
        return;
      }

      var cancelationStatusSucess = "6";

      if (apiRes.body.ReturnCode != cancelationStatusSucess) {
        reject({
          message: 'The transaction cancelation not worked well: ' + apiRes.body.ReturnMessage,
          data: apiRes.body
        });
        return;
      }

      resolve();
    });
  });
};

exports.default = service;
//# sourceMappingURL=cieloCancelation.js.map