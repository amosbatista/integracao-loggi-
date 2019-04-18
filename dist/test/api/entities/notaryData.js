'use strict';

var _notaryData = require('../../../api/entities/notaryData');

var _notaryData2 = _interopRequireDefault(_notaryData);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = _chai2.default.expect;

describe('Notary data test', function () {

  it('should be an object', function () {
    expect(_notaryData2.default).to.be.an('object');
  });

  it('entity should serve the necessary properties', function () {

    var expectNotaryData = expect(_notaryData2.default);

    expectNotaryData.that.have.property('streetName');
    expectNotaryData.that.have.property('streetNumber');
    expectNotaryData.that.have.property('neighborhood');
    expectNotaryData.that.have.property('city');
    expectNotaryData.that.have.property('state');
    expectNotaryData.that.have.property('country');
    expectNotaryData.that.have.property('countryShortName');
    expectNotaryData.that.have.property('postalCode');
  });
});
//# sourceMappingURL=notaryData.js.map