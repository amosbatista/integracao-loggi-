import { Router } from 'express';
import facets from './facets';
import httpReq from 'superagent';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		httpReq.post('https://staging.loggi.com/public-graphql/')
			.query({query:'mutation { login(input:{email: \"amos.silva@gmail.com\", password: \"iunarihs45@\" }) { user { apiKey } } }'})
			.end((err, apiRes) => {
				if(err){
					res.send(err)
				}
				res.send(apiRes)
			});
	});

	return api;
}
