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
import geo from './geo';
import cancel from './cancel';
import cancelWithTax from './cancelWithtax';
import confirmCancell from './confirmCancellation';
import checkPaymentMethod from './checkPaymentMethod';
import savePaymentMethod from './savePaymentMethod';
import courierPosition from './courierPosition';
import updateDeliveryStatusCallBack from './updateDeliveryStatusCallBack'

import testDomain from './test-api-without-domain';
import version from './apiVersion';

import middleware from '../../middleware'
	
import auth from '../../auth/api/index';

export default ({ config, db }) => {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
	let api = Router();
	const noResponseCode = 501
	
	// internal middleware
	api.use(middleware({ config, db }));

	api.use('/confirm', confirm({ config, db }));
	api.use('/approve', approve({ config, db }));
	api.use('/finish', finish({ config, db }));
	api.use('/pay', pay({ config, db }));
	api.use('/receive', receive({ config, db }));
	api.use('/return', returnApi({ config, db }));
	api.use('/list', list({ config, db }));
	api.use('/purchaseValue', purchaseValue({ config, db }));
	api.use('/detail', detail({ config, db }));
	api.use('/geo', geo({ config, db }));
	api.use('/testdomain', testDomain({config, db}));
	api.use('/auth', auth({config, db}));
	api.use('/cancel-tax', cancelWithTax({config, db}));
	api.use('/check-card', checkPaymentMethod({config, db}));
	api.use('/save-card', savePaymentMethod({config, db}));
	api.use('/cancel', cancel({config, db}));
	api.use('/confirm-cancel', confirmCancell({config, db}));
  api.use('/position', courierPosition({config, db}));
	api.use('/callback-update-delivery', updateDeliveryStatusCallBack({config, db}));
	api.use('/version', version({config, db}));

	// perhaps expose some API metadata at the root
	api.post('/', (req, res) => {
		res.status(noResponseCode).json('empty post request')
	});

	api.get('/', (req, res) => {
		res.status(noResponseCode).json('empty get request')
	});

	return api;
}
