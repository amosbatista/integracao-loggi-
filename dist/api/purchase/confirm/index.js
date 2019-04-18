'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _service = require('./service');

var _service2 = _interopRequireDefault(_service);

var _service3 = require('../../login/service');

var _service4 = _interopRequireDefault(_service3);

var _transactionEcommerce = require('../../taxs/transactionEcommerce');

var _transactionEcommerce2 = _interopRequireDefault(_transactionEcommerce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // perhaps expose some API metadata at the root
  api.post('/', function (req, res) {

    res.status(505).send('I m on confirm');
    res.end();
    return;
    var STATUS_UNAUTHORIZED = 401;
    var STATUS_SERVER_ERROR = 500;

    (0, _service4.default)().then(function (authData) {

      (0, _service2.default)(req.body.addressData, authData.toString()).then(function (apiRes) {

        var servicesSum = req.body.servicesData.services.reduce(function (total, current) {
          return total + current.value * current.amount;
        }, 0);

        var deliveryTax = apiRes.estimatedCost;
        var transactionOperationTax = (0, _transactionEcommerce2.default)(servicesSum + deliveryTax);
        var totalPurchase = servicesSum + deliveryTax + transactionOperationTax.calculedValue;

        res.json({
          servicesSum: servicesSum,
          deliveryTax: deliveryTax,
          transactionOperationTax: transactionOperationTax,
          totalPurchase: totalPurchase
        });
        res.end();
      }).catch(function (err) {
        res.status(STATUS_SERVER_ERROR).send(err.message);
        console.log(err.message, err.object);
        res.end();
      });
    }).catch(function (err) {
      console.log(err.message, err.data);
      res.status(STATUS_UNAUTHORIZED).send(err.message);
      res.end();
    });
  });

  return api;
};
//# sourceMappingURL=index.js.map