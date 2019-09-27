import { Router } from 'express';

import confirm from './confirm';
import approve from './approve';
import finish from './finish';
import pay from './pay';
import receive from './receive';
import returnApi from './return';
import list from './list';
import purchaseValue from './purchaseValue';
import detail from './detail';

export default ({ config, db }) => {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
	let api = Router();
	const noResponseCode = 501

	api.use('/confirm', confirm({ config, db }));
	api.use('/approve', approve({ config, db }));
	api.use('/finish', finish({ config, db }));
	api.use('/pay', pay({ config, db }));
	api.use('/receive', receive({ config, db }));
	api.use('/return', returnApi({ config, db }));
	api.use('/list', list({ config, db }));
	api.use('/purchaseValue', purchaseValue({ config, db }));
	api.use('/detail', detail({ config, db }));

	// perhaps expose some API metadata at the root
	api.post('/', (req, res) => {
		res.status(noResponseCode).send('empty post request')
	});

	api.get('/', (req, res) => {
		res.status(noResponseCode).send('empty get request')
	});

	return api;
}
