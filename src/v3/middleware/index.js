import { Router } from 'express';
import authenticatedRouteMiddleware from './passBy.middleware';

export default ({ config, db }) => {
	let api = Router();

	// registering apis to middleware
	api.use('/auth/load', authenticatedRouteMiddleware({config, db}));

	return api;
}
