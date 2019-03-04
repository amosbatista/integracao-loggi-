import { Router } from 'express';
import facets from './facets';
import login from './login';

export default ({ config, db }) => {
	let api = Router();
	const noResponseCode = 501

	api.use('/facets', facets({ config, db }));
	api.use('/login', login({ config, db }));

	// perhaps expose some API metadata at the root
	api.post('/', (req, res) => {
		res.status(noResponseCode).send()
	});

	api.get('/', (req, res) => {
		res.status(noResponseCode).send()
	});

	return api;
}
