import { Router } from 'express';
import authenticatedRouteMiddleware from './authenticatedRouteMiddleware';

export default ({ config, db }) => {
	let api = Router();

	// registering apis to middleware
	api.use('/list', authenticatedRouteMiddleware({ config, db }));
	api.use('/confirm', authenticatedRouteMiddleware({ config, db }));
	api.use('/approve', authenticatedRouteMiddleware({ config, db }));
	api.use('/finish', authenticatedRouteMiddleware({ config, db }));
	api.use('/pay', authenticatedRouteMiddleware({ config, db }));
	api.use('/receive', authenticatedRouteMiddleware({ config, db }));
	api.use('/return', authenticatedRouteMiddleware({ config, db }));
	api.use('/purchaseValue', authenticatedRouteMiddleware({ config, db }));
	api.use('/detail', authenticatedRouteMiddleware({ config, db }));
	api.use('/geo', authenticatedRouteMiddleware({ config, db }));
	api.use('/testdomain', authenticatedRouteMiddleware({config, db}));
	api.use('/auth/load', authenticatedRouteMiddleware({config, db}));

	return api;
}
