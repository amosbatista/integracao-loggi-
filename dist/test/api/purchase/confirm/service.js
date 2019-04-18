'use strict';

var _service = require('../../../../api/purchase/confirm/service');

var _service2 = _interopRequireDefault(_service);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = _chai2.default.expect;

describe('Purchase service test', function () {

  it('should be a function that receives address parameters and returns a string with its data', function () {
    expect(addressComponent).to.be.a('function');

    var adressDataTest = {
      streetNumber: '123',
      streetName: 'Rua Igor Tavares',
      neighborhood: 'Parque Foobar',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brasil',
      countryShortName: 'BR',
      postalCode: '001122122'
    };

    var expected = '{\n    addressComponents: [\n      {longName: "123", shortName: "123", types: ["street_number"]}, \n      {longName: "Rua Igor Tavares", shortName: "Rua Igor Tavares", types: ["route"]}, \n      {longName: "Parque Foobar", shortName: "Parque Foobar", types: ["neighborhood", "political"]}, \n      {longName: "S\xE3o Paulo", shortName: "S\xE3o Paulo", types: ["locality", "political"]}, \n      {longName: "SP", shortName: "SP", types: ["administrative_area_level_2", "political"]},\n      {longName: "SP", shortName: "SP", types: ["administrative_area_level_1", "political"]}, \n      {longName: "Brasil", shortName: "BR", types: ["country", "political"]}, \n      {longName: "001122122", shortName: "001122122", types: ["postal_code"]}\n    ], \n    formattedAddress: "Rua Igor Tavares, 123 - Parque Foobar, S\xE3o Paulo - SP, 001122122, Brasil",\n    types: ["street_address"]\n  }';

    expect(addressComponent(adressDataTest)).be.deep.equal(expected);
  });
});
//# sourceMappingURL=service.js.map