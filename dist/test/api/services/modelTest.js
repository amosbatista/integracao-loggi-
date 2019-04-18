'use strict';

var _model = require('../../../api/services/model');

var _model2 = _interopRequireDefault(_model);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = _chai2.default.expect;

describe('Service list test', function () {

  it('should be an array', function () {
    expect(_model2.default).to.be.an('array');
  });

  it('first service should serves service data', function () {
    var expectService0ToBeAnObject = expect(_model2.default[0]).to.be.an('object');

    expectService0ToBeAnObject.that.have.property('id').that.is.a('number');
    expectService0ToBeAnObject.that.have.property('text').that.is.a('string');
    expectService0ToBeAnObject.that.have.property('value').that.is.a('number');
    expectService0ToBeAnObject.that.have.property('formatted').that.is.a('string');
    expectService0ToBeAnObject.that.have.property('description').that.is.a('string');
    expectService0ToBeAnObject.that.have.property('quantifier').that.is.a('string');
  });

  it('second service should serves service data too', function () {
    var expectService0ToBeAnObject = expect(_model2.default[1]).to.be.an('object');

    expectService0ToBeAnObject.that.have.property('id').that.is.a('number');
    expectService0ToBeAnObject.that.have.property('text').that.is.a('string');
    expectService0ToBeAnObject.that.have.property('value').that.is.a('number');
    expectService0ToBeAnObject.that.have.property('formatted').that.is.a('string');
    expectService0ToBeAnObject.that.have.property('description').that.is.a('string');
    expectService0ToBeAnObject.that.have.property('quantifier').that.is.a('string');
  });
});
//# sourceMappingURL=modelTest.js.map