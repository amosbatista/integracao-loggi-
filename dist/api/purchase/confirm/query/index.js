"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _addressComponents = require("./addressComponents");

var _addressComponents2 = _interopRequireDefault(_addressComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var query = function query(originData, notaryData) {
  var formatedQuery = "\n  mutation {\n    createOrderInquiry(input: {\n      city: 1\n      packageType: \"document\"\n      slo: 1\n      clientMutationId: \"test_inquiry\"\n      waypoints: [\n        {\n          addressComplement: \"" + originData.addressComplement + "\"\n          instructions: \"Retirada de documento\"\n          tag: , retirar_documento\n          addressData: " + (0, _addressComponents2.default)(originData) + "\n        }, \n        {\n          addressComplement: \"Complemento da entrega\"\n          instructions: \"Entregar documento\"\n          tag: entregar\n          addressData: " + (0, _addressComponents2.default)(notaryData) + "\n        }]\n    }) {\n      success\n      inquiry {\n        pk\n        pricing {\n          totalCmGross\n          bonuses\n          totalCm\n          appliedBonuses {\n            discount\n            key\n            usercode\n          }\n        }\n        numWaypoints\n        productDescription\n        paymentMethod {\n          name\n        }\n      }\n      errors {\n        field\n        message\n      }\n    }\n  }";
  return formatedQuery.replace(/(\r\n|\n|\r)/gm, "");
};
exports.default = query;
//# sourceMappingURL=index.js.map