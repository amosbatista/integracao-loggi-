'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// {
//   orderId: 0
// }

var service = function service(orderId, auth) {

  return new Promise(function (resolve, reject) {

    _superagent2.default.post(process.env.LOGGI_API_V2).send({
      "query": 'mutation {\n        cancelOrder(input: {\n          id: ' + orderId + '\n          clientMutationId: "test_cancel"\n        }) {\n          success\n          order {\n            status\n          }\n        }\n      }'
    }).set('Content-Type', "application/json").set('authorization', auth).end(function (err, apiRes) {

      if (err) {
        reject({
          message: "Error at Loggi's API order cancelation",
          data: err
        });
      }

      if (!apiRes.body.data.cancelOrder.success) {
        reject({
          message: 'The Loggi\'s order cancelation has response, but returned errors',
          data: apiRes.body.data.confirmOrder.errors
        });
      }

      resolve();
    });
  });
};

exports.default = service;
//# sourceMappingURL=loggiCancelation.js.map