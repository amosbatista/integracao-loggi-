'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var taxValue = 2.40;

var tax = function tax(transactionValue) {
  var valuePostTax = parseFloat(transactionValue) + taxValue;
  return {
    taxValue: taxValue,
    description: 'Taxa E-commerce',
    calculedValue: valuePostTax
  };
};

exports.default = tax;
//# sourceMappingURL=transactionEcommerce.js.map