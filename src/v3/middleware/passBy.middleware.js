import { Router } from 'express';

export default ({ config, db }) => {
	let api = Router();
    
		api.post('/', async (req, res, next) => {
    
      res.setHeader("auth-token", "foo")
      next();
    });

	return api;
}
