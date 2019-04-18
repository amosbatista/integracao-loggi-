'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _index = require('./purchase/confirm/index');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('./purchase/approve/index');

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
	var config = _ref.config,
	    db = _ref.db;

	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
	var api = (0, _express.Router)();
	var noResponseCode = 501;

	api.use('/confirm', (0, _index2.default)({ config: config, db: db }));
	api.use('/approve', (0, _index4.default)({ config: config, db: db }));

	console.log('setting api route');

	// perhaps expose some API metadata at the root
	api.post('/', function (req, res) {
		res.status(noResponseCode).send('empty post request');
	});

	api.get('/', function (req, res) {
		res.status(noResponseCode).send('empty get request');
	});

	return api;
};
//# sourceMappingURL=index.js.map