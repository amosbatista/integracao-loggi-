import { Router } from 'express';

import newUser from './newUserApi';
import loadUser from './loadUserApi';
import auth from './loginApi';

export default ({ config, db }) => {
	let api = Router();

	api.use('/new', newUser({config, db}))
  api.use('/load', loadUser({config, db}))	
  api.use('/', auth({config, db}))

	return api;
}
