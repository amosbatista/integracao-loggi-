'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// {
//   clientName, address, number, neighborhood, totalPurchase, 
//   creditCardData: {
//     numberFromAPI, brand, holder,proofOfSale, tid, authorizationCode, paymentId, linksData 
//   }
// }

var service = function () {
  function service() {
    _classCallCheck(this, service);

    var maxConnections = 5;
    var minConnections = 1;
    var idleSecondsBeforeClose = 10000;

    this.sequelize = new _sequelize2.default(process.env.LOG_DATABASE, process.env.LOG_LOGIN, process.env.LOG_PASSWORD, {
      host: process.env.LOG_HOST,
      dialect: process.env.LOG_DATABASE_TYPE,

      pool: {
        max: maxConnections,
        min: minConnections,
        idle: idleSecondsBeforeClose
      }
    });

    this.transactionLog = this.sequelize.define('transactionLog', {
      clientName: {
        type: _sequelize2.default.STRING
      },
      clientEmail: {
        type: _sequelize2.default.STRING
      },
      clientPhone: {
        type: _sequelize2.default.STRING
      },
      completeAddress: {
        type: _sequelize2.default.STRING,
        allowNull: true
      },
      addressComplement: {
        type: _sequelize2.default.STRING
      },
      totalPurchase: {
        type: _sequelize2.default.DECIMAL
      },
      deliveryTax: {
        type: _sequelize2.default.DECIMAL
      },
      servicesSum: {
        type: _sequelize2.default.DECIMAL
      },
      transactionOperationTax: {
        type: _sequelize2.default.DECIMAL
      },
      creditCardNumberFromAPI: {
        type: _sequelize2.default.STRING
      },
      creditCardBrand: {
        type: _sequelize2.default.STRING
      },
      creditCardHolder: {
        type: _sequelize2.default.STRING
      },
      creditCardProofOfSale: {
        type: _sequelize2.default.STRING
      },
      creditCardTid: {
        type: _sequelize2.default.STRING
      },
      creditCardAuthorizationCode: {
        type: _sequelize2.default.STRING
      },
      creditCardPaymentId: {
        type: _sequelize2.default.STRING
      },
      creditCardLinksData: {
        type: _sequelize2.default.TEXT
      }
    });
  }

  _createClass(service, [{
    key: 'save',
    value: function save(transactionData) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var transactionLog = _this.transactionLog;

        transactionLog.sync().then(function () {
          transactionLog.create({
            clientName: transactionData.clientName,
            clientEmail: transactionData.clientEmail,
            clientPhone: transactionData.clientPhone,
            completeAddress: transactionData.completeAddress,
            addressComplement: transactionData.addressComplement,
            totalPurchase: transactionData.totalPurchase,
            servicesSum: transactionData.servicesSum,
            deliveryTax: transactionData.deliveryTax,
            transactionOperationTax: transactionData.transactionOperationTax,
            creditCardNumberFromAPI: transactionData.creditCard.numberFromAPI,
            creditCardBrand: transactionData.creditCard.brand,
            creditCardHolder: transactionData.creditCard.holder,
            creditCardProofOfSale: transactionData.creditCard.proofOfSale,
            creditCardTid: transactionData.creditCard.tid,
            creditCardAuthorizationCode: transactionData.creditCard.authorizationCode,
            creditCardPaymentId: transactionData.creditCard.paymentId,
            creditCardLinksData: JSON.stringify(transactionData.creditCard.linksData)
          }).then(function () {
            resolve();
          }).catch(function (err) {
            reject({
              message: 'Error at log into database',
              data: err
            });
          });
        });
      });
    }
  }]);

  return service;
}();

exports.default = service;
//# sourceMappingURL=log.js.map