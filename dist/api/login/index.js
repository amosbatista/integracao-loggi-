'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _service = require('./service');

var _service2 = _interopRequireDefault(_service);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // perhaps expose some API metadata at the root
  api.post('/', function (req, res) {
    var login = req.body.login;
    var password = req.body.password;
    var STATUS_UNAUTHORIZED = 401;

    (0, _service2.default)(login, password).then(function (apiResponse) {
      res.json({
        apiId: apiId
      });
    }).catch(function (apiError) {
      console.log(apiError.message, apiError.data);
      res.status(STATUS_UNAUTHORIZED).send(apiError.message);
    });
  });

  return api;
};
//# sourceMappingURL=index.js.map