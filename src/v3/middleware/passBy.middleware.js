import { Router } from 'express';

export default ({ config, db }) => {
	let api = Router();
    
  api.all('/', async (req, res, next) => {
  
    res.setHeader("auth-token", "foo")
    next();
  });

	return api;
}
