import { Router } from 'express';
import confirm from './purchase/confirm/index';
import approve from './purchase/approve/index';

export default ({ config, db }) => {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
	let api = Router();
	const noResponseCode = 501

	api.use('/confirm', confirm({ config, db }));
	api.use('/approve', approve({ config, db }));

	// perhaps expose some API metadata at the root
	api.post('/', (req, res) => {
		res.status(noResponseCode).send()
	});

	api.get('/', (req, res) => {
		res.status(noResponseCode).send()
	});

	return api;
}
