import { Router } from 'express';
import loadAll from './loadAll';
import newComic from './newComic';
import _delete from './delete';
import load from './load';
import pages from '../page/api'
import update from './update';


export default ({ config, db }) => {
	let api = Router();

	api.use('/', loadAll({config, db}))
	api.use('/load', load({config, db}))
	api.use('/', newComic({config, db}))
	api.use('/', _delete({config, db}))
	api.use('/', update({config, db}))

	api.use('/page', pages({config, db}))

	return api;
}
