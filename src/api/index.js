import { Router } from 'express';
import login from './login';
import newRequest from './newRequest/index';

export default ({ config, db }) => {
	let api = Router();
	const noResponseCode = 501

	api.use('/login', login({ config, db }));
	api.use('/newRequest', newRequest({ config, db }));

	// perhaps expose some API metadata at the root
	api.post('/', (req, res) => {
		res.status(noResponseCode).send()
	});

	api.get('/', (req, res) => {
		res.status(noResponseCode).send()
	});

	return api;
}
