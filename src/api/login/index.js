import { Router } from 'express';
import Service from './service'

export default ({ config, db }) => {
	let api = Router();

	// perhaps expose some API metadata at the root
	api.post('/', (req, res) => {
    const login = req.body.login
    const password = req.body.password
    const STATUS_UNAUTHORIZED = 401

    Service(login, password).then( (apiResponse) => {
      res.json({
          apiId: apiId
      })
    }).catch((apiError) => {
      res.status(STATUS_UNAUTHORIZED).send(apiError.message)
    })
	});

	return api;
}
