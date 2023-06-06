import { Router } from 'express';
import _delete from './delete';
import move from './move';
import _new from './new';


export default ({ config, db }) => {
	let api = Router();

	api.use('/', _delete({config, db}))
	api.use('/', move({config, db}))
	api.use('/', _new({config, db}))

	return api;
}
