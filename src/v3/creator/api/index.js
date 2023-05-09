import { Router } from 'express';
import promoteToCreator from './promoteToCreator';
import depromoteFromCreator from './depromoteFromCreator';
import update from './update';

export default ({ config, db }) => {
	let api = Router();

	api.use('/promote', promoteToCreator({config, db}))
	api.use('/depromote', depromoteFromCreator({config, db}))
	api.use('/', update({config, db}))
	

	return api;
}
