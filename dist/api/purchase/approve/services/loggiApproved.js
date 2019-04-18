'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// {
//   inquiryId: 0
// }

var service = function service(addressData, servicesData, paymentData, auth) {

  return new Promise(function (resolve, reject) {

    var notariusStoreId = process.env.LOGGI_STORE_ID;
    var paymentMethodAlreadyChaged = 64;

    var notariusAddress = {
      lat: -23.5857434,
      lng: -46.6785174,
      completeAddress: 'R. Joaquim Floriano, 889 - Itaim Bibi, São Paulo - SP, 04534-011, Brazil',
      complement: ""
    };

    var query = 'mutation {\n      createOrder(input: {\n        shopId: ' + notariusStoreId + '\n        pickups: [{\n          address: {\n            lat: ' + addressData.coordinates.lat + '\n            lng: ' + addressData.coordinates.lng + '\n            address: "' + addressData.completeAddress + '"\n            complement: "' + addressData.addressComplement + '"\n          }\n        }]\n        packages: [{\n          pickupIndex: 0\n          recipient: {\n            name: "' + servicesData.clientName + '"\n            phone: "' + servicesData.clientPhone + '"\n          }\n          address: {\n            lat: ' + notariusAddress.lat + '\n            lng: ' + notariusAddress.lng + '\n            address: "' + notariusAddress.completeAddress + '"\n            complement: "' + notariusAddress.complement + '"\n          }\n          charge: {\n            value: "' + paymentData.deliveryTax + '"\n            method: ' + paymentMethodAlreadyChaged + '\n            change: "0.00"\n          }\n          dimensions: {\n            width: 10\n            height: 10\n            length: 10\n          }\n        }]\n      }) {\n        success\n        shop {\n          pk\n          name\n          order {\n            pk\n            packages {\n              pk\n              status\n              pickupWaypoint {\n                index\n                indexDisplay\n                eta\n                legDistance\n              }\n              waypoint {\n                index\n                indexDisplay\n                eta\n                legDistance\n              }\n            }\n          }\n        }\n        errors {\n          field\n          message\n        }\n      }\n    }\n    ';

    console.log(query);

    _superagent2.default.post(process.env.LOGGI_API_V2).send({
      "query": query
    }).set('Content-Type', "application/json").set('authorization', auth).end(function (err, apiRes) {
      if (err) {

        reject({
          message: "Error at Loggi's API order confirmation",
          data: err
        });
        return;
      }

      if (!apiRes.body.data.createOrder.success) {

        reject({
          message: 'The Loggi\'s order confirmation has response, but returned errors',
          data: apiRes.body.data.createOrder.errors
        });
        return;
      }

      resolve({
        "loggiOrderId": apiRes.body.data.createOrder.shop.pk
      });
    });
  });
};

exports.default = service;
//# sourceMappingURL=loggiApproved.js.map