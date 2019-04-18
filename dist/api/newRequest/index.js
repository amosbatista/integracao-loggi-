'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _index = require('./query/index');

var _index2 = _interopRequireDefault(_index);

var _notaryData = require('../entities/notaryData');

var _notaryData2 = _interopRequireDefault(_notaryData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;

    var api = (0, _express.Router)();

    // perhaps expose some API metadata at the root
    api.post('/', function (req, res) {
        var STATUS_UNAUTHORIZED = 401;
        var STATUS_SERVER_ERROR = 500;
        var apiId = req.get('Authorization');
        var userLogin = req.get('UserLogin');

        if (!apiId) {
            res.status(STATUS_UNAUTHORIZED).send('Unauthenticated');
        } else {
            console.log(JSON.stringify({
                query: (0, _index2.default)(req.body, _notaryData2.default)
            }));
            _superagent2.default.post(process.env.LOGGI_API_V2).query({
                query: (0, _index2.default)(req.body, _notaryData2.default)
            }).set('authorization', 'Apikey ' + userLogin + ':' + apiId).end(function (err, apiRes) {

                if (err) {
                    console.log('Error at API new request', err.res.body);
                    res.status(STATUS_SERVER_ERROR).send('Error in client API request');
                    res.end();
                } else {
                    res.json({
                        newRequestId: 1234
                    });
                    // if(apiRes.body.errors.length >= 0){
                    //     res.status(STATUS_SERVER_ERROR).send('API request is done but there"s errors ')
                    //     console.log('Errors at API new request return', JSON.stringify(apiRes.body.errors))
                    //     res.end()
                    // }
                    // else{
                    //     res.json({
                    //         newRequestId: apiRes.body
                    //     })
                    // }
                }
            });
        }
    });

    return api;
};
//# sourceMappingURL=index.js.map