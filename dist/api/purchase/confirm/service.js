'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var service = function service(addressData, auth) {

  return new Promise(function (resolve, reject) {

    var notariusStoreId = process.env.LOGGI_STORE_ID;
    var originCoordinate = addressData.coordinates;

    var query = 'query {\n      estimate(\n        shopId: ' + notariusStoreId + ',\n        packagesDestination: [\n          {\n            lat: ' + originCoordinate.lat + ',\n            lng: ' + originCoordinate.lng + '   \n          }\n        ]\n        chargeMethod: 1,\n        optimize: true\n      ) {\n        packages {\n          error\n          eta\n          index\n          rideCm\n          outOfCityCover\n          outOfCoverageArea\n          originalIndex\n          waypoint {\n            indexDisplay\n            originalIndexDisplay\n            role\n          }\n        }\n        routeOptimized\n        normal {\n          cost\n          distance\n          eta\n        }\n        optimized {\n          cost\n          distance\n          eta\n        }\n      }   \n    }\n    ';

    _superagent2.default.post(process.env.LOGGI_API_V2).send({
      query: query
    }).set('Authorization', auth).set('Content-Type', 'application/json').end(function (err, apiRes) {

      if (err) {
        reject({
          message: 'Error in client API request',
          object: JSON.stringify(err)
        });

        return;
      }

      var firstPackage = 0;

      if (apiRes.body.data.estimate.packages[firstPackage].error) {
        reject({
          message: 'API request is done but there"s errors ',
          object: JSON.stringify(apiRes.body.data.estimate.packages[firstPackage].error)
        });

        return;
      }

      if (apiRes.body.data.estimate.packages[firstPackage].outOfCityCover) {
        reject({
          message: 'Delivery request is so far from São Paulo.',
          object: ""
        });

        return;
      }

      if (apiRes.body.data.estimate.packages[firstPackage].outOfCoverageArea) {
        reject({
          message: 'Delivery request is so far from Loggi',
          object: ""
        });

        return;
      }

      resolve({
        estimatedCost: apiRes.body.data.estimate.packages[firstPackage].rideCm
      });
    });
  });
};

exports.default = service;
//# sourceMappingURL=service.js.map