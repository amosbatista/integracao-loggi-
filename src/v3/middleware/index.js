import { Router } from 'express';
import authenticatedRouteMiddleware from './authenticatedRouteMiddleware';

export default ({ config, db }) => {
	let api = Router();

	// registering apis to middleware
	api.use('/auth/load', authenticatedRouteMiddleware({config, db}));
	api.use('/auth/load/all', authenticatedRouteMiddleware({config, db}));
	api.use('/creator', authenticatedRouteMiddleware({config, db}));
	api.use('/comic', authenticatedRouteMiddleware({config, db}));

	return api;
}
