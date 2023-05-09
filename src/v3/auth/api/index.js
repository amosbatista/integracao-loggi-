import { Router } from 'express';

import newUser from './newUserApi';
import loadUser from './loadUserApi';
import listAll from './listAll';
import auth from './loginApi';
import updatePwd from './updatePwd';
import update from './update';
import promoteToAdmin from './promoteToAdmin';
import depromoteFromAdmin from './depromoteFromAdmin';

export default ({ config, db }) => {
	let api = Router();

	api.use('/new', newUser({config, db}))
  api.use('/load', loadUser({config, db}))	
	api.use('/load/all', listAll({config, db}))	
	api.use('/update-pwd', updatePwd({config, db}))	
	api.use('/', update({config, db}))	
	api.use('/promote-admin', promoteToAdmin({config, db}))	
	api.use('/depromote-admin', depromoteFromAdmin({config, db}))	
  api.use('/', auth({config, db}))

	return api;
}
