import { Router } from 'express';
import { NO_RESPONSE_CODE } from '../shared/statusCodes.const'


import version from './apiVersion';	
import featured from './posts/featured.api';
import postList from './posts/postList.api'
import top from './posts/top.api'

export default ({ config, db }) => {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

	let api = Router();
	
	api.use('/version', version({config, db}));
	api.use('/posts', postList({config, db}));
	api.use('/featured', featured({config, db}));
	api.use('/top', top({config, db}));


	// perhaps expose some API metadata at the root
	api.post('/', (req, res) => {
		res.status(NO_RESPONSE_CODE).json('empty post request')
	});

	api.get('/', (req, res) => {
		res.status(NO_RESPONSE_CODE).json('empty get request')
	});

	return api;
}
