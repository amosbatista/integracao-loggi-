"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var model = function () {
  function model(login, password, authorization) {
    _classCallCheck(this, model);

    this.userLogin = login;
    this.userPassword = password;
    this.authorization = authorization;
  }

  _createClass(model, [{
    key: "login",
    value: function login() {
      return this.userLogin;
    }
  }, {
    key: "password",
    value: function password() {
      return this.userPassword;
    }
  }, {
    key: "authorization",
    value: function authorization() {
      return this.authorization;
    }
  }, {
    key: "toString",
    value: function toString() {
      return "Apikey " + this.userLogin + ":" + this.authorization;
    }
  }]);

  return model;
}();

exports.default = model;
//# sourceMappingURL=model.js.map