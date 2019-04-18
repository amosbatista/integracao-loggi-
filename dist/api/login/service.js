'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _model = require('./model');

var _model2 = _interopRequireDefault(_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var validate = function validate(login, password) {
  return login != '' && password != '';
};

var service = function service() {

  return new Promise(function (resolve, reject) {

    var login = process.env.LOGGI_USER_LOGIN;
    var password = process.env.LOGGI_USER_PASSWORD;

    if (!validate(login, password)) {
      reject({
        message: 'Login or password is empty'
      });
    } else {
      _superagent2.default.post(process.env.LOGGI_API_V2).query({ query: 'mutation { login(input:{email: \"' + login + '\", password: \"' + password + '\" }) { user { apiKey } } }' }).end(function (err, response) {

        if (err) {
          reject({
            message: 'Error in client API request',
            data: err
          });

          return;
        }

        var resData = JSON.parse(response.text);

        try {
          var apiId = resData.data.login.user.apiKey;
          var authData = new _model2.default(login, password, apiId);

          resolve(authData);
        } catch (err) {

          reject({
            message: 'It was impossible to generate user key. Check your password or login',
            data: err
          });
        }
      });
    }
  });
};

exports.default = service;
//# sourceMappingURL=service.js.map