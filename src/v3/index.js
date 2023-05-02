import { Router } from 'express';

import middleware from './middleware'

import version from './apiVersion';	
import auth from './auth/api/index';

export default ({ config, db }) => {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
	let api = Router();
	const noResponseCode = 501
	
	// internal middleware
	api.use(middleware({ config, db }));

	api.use('/auth', auth({config, db}));
	api.use('/version', version({config, db}));

	// perhaps expose some API metadata at the root
	api.post('/', (req, res) => {
		res.status(noResponseCode).json('empty post request')
	});

	api.get('/', (req, res) => {
		res.status(noResponseCode).json('empty get request')
	});

	return api;
}
