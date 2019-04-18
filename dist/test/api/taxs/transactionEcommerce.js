'use strict';

var _transactionEcommerce = require('../../../api/taxs/transactionEcommerce');

var _transactionEcommerce2 = _interopRequireDefault(_transactionEcommerce);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = _chai2.default.expect;

describe('Taxs test', function () {

  it('should be a function that applyes a transaction tax to some value', function () {
    expect(_transactionEcommerce2.default).to.be.a('function');

    var valuePreTax = 23.44;
    var expected = {
      taxValue: 2.40,
      description: 'Taxa E-commerce',
      calculedValue: 25.84
    };

    expect((0, _transactionEcommerce2.default)(valuePreTax)).be.deep.equal(expected);

    var secondValuePreTax = 0.85;
    var secondExpected = {
      taxValue: 2.40,
      description: 'Taxa E-commerce',
      calculedValue: 3.25
    };

    expect((0, _transactionEcommerce2.default)(secondValuePreTax)).be.deep.equal(secondExpected);
  });
});
//# sourceMappingURL=transactionEcommerce.js.map