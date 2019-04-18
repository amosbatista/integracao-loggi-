'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _service = require('../../login/service');

var _service2 = _interopRequireDefault(_service);

var _cieloCancelation = require('./services/cieloCancelation');

var _cieloCancelation2 = _interopRequireDefault(_cieloCancelation);

var _cieloTransaction = require('./services/cieloTransaction');

var _cieloTransaction2 = _interopRequireDefault(_cieloTransaction);

var _loggiApproved = require('./services/loggiApproved');

var _loggiApproved2 = _interopRequireDefault(_loggiApproved);

var _loggiCancelation = require('./services/loggiCancelation');

var _loggiCancelation2 = _interopRequireDefault(_loggiCancelation);

var _log = require('./services/log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // perhaps expose some API metadata at the root
  api.post('/', function (req, res) {
    var STATUS_UNAUTHORIZED = 401;
    var STATUS_SERVER_ERROR = 500;

    console.log('Start of transaction process');
    console.log("On Loggi's auth");

    (0, _service2.default)().then(function (authData) {

      console.log("On Credit Card operator process");
      (0, _cieloTransaction2.default)(req.body.paymentData).then(function (creditCardReturnData) {

        console.log("On Loggi's order approvation");
        (0, _loggiApproved2.default)(req.body.addressData, req.body.servicesData, req.body.paymentData, authData.toString()).then(function (loggiData) {

          console.log("After transaction finish, on log process");
          var log = new _log2.default();

          log.save({
            clientName: req.body.servicesData.clientName,
            clientEmail: req.body.servicesData.clientEmail,
            clientPhone: req.body.servicesData.clientPhone,
            completeAddress: req.body.addressData.completeAddress,
            addressComplement: req.body.addressData.addressComplement,
            totalPurchase: req.body.paymentData.totalAmount,
            deliveryTax: req.body.paymentData.deliveryTax,
            servicesSum: req.body.paymentData.servicesSum,
            transactionOperationTax: req.body.paymentData.transactionOperationTax.calculedValue,
            creditCard: {
              numberFromAPI: creditCardReturnData.Payment.CreditCard.CardNumber,
              brand: creditCardReturnData.Payment.CreditCard.Brand,
              holder: creditCardReturnData.Payment.CreditCard.Holder,
              proofOfSale: creditCardReturnData.Payment.ProofOfSale,
              tid: creditCardReturnData.Payment.Tid,
              authorizationCode: creditCardReturnData.Payment.AuthorizationCode,
              paymentId: creditCardReturnData.Payment.PaymentId,
              linksData: creditCardReturnData.Payment.Links
            }
          }).then(function () {

            res.json({
              isProcessOk: true,
              loggiOrderId: loggiData.loggiOrderId,
              paymentId: creditCardReturnData.Payment.PaymentId
            });
            res.end();
          }).catch(function (err) {
            console.log(err.message, err.data);

            console.log("Trying to rollback transactions, after database failure.");
            Promise.all([(0, _cieloCancelation2.default)(creditCardReturnData.Payment.PaymentId, req.body.paymentData.totalAmount), (0, _loggiCancelation2.default)(loggiData.loggiOrderId, authData.toString())]).then(function () {
              res.status(STATUS_SERVER_ERROR).send(err.message);
              res.end();
            }).catch(function (err) {
              console.log(err.message, err.data);
              res.status(STATUS_SERVER_ERROR).send(err.message);
              res.end();
            });
          });
        }).catch(function (err) {
          console.log(err.message, err.data);
          (0, _cieloCancelation2.default)(creditCardReturnData.Payment.PaymentId, req.body.paymentData.totalAmount).then(function () {
            res.status(STATUS_SERVER_ERROR).send(err.message);
            res.end();
          }).catch(function (err) {
            console.log(err.message, err.data);
            res.status(STATUS_SERVER_ERROR).send(err.message);
            res.end();
          });
        });
      }).catch(function (err) {
        console.log(err.message, err.data);
        res.status(STATUS_SERVER_ERROR).send(err.message);
        res.end();
      });
    }).catch(function (err) {
      console.log('Unauthorized atempt to conclude order', err);
      res.status(STATUS_UNAUTHORIZED).send(err.message);
      res.end();
    });
  });

  return api;
};
//# sourceMappingURL=index.js.map