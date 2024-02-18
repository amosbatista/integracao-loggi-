import { Router } from 'express';
import { NO_RESPONSE_CODE } from '../shared/statusCodes.const'


import version from './apiVersion';	
import home from './home';

export default ({ config, db }) => {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

	let api = Router();
	
	api.use('/version', version({config, db}));
	api.use('/home', home({config, db}));

	// perhaps expose some API metadata at the root
	api.post('/', (req, res) => {
		res.status(NO_RESPONSE_CODE).json('empty post request')
	});

	api.get('/', (req, res) => {
		res.status(NO_RESPONSE_CODE).json('empty get request')
	});

	return api;
}
