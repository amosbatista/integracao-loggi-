import { Router } from 'express';
import loadAll from './loadAll';
import newComic from './newComic';
import _delete from './delete';


export default ({ config, db }) => {
	let api = Router();

	api.use('/', loadAll({config, db}))
	api.use('/', newComic({config, db}))
	api.use('/', _delete({config, db}))

	return api;
}
