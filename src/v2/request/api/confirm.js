import { Router } from 'express'
import purchaseService from '../../delivery/clickEntregas/clickEntregasEstimateService'
import calcService from '../purchaseCalculator'
import logService from '../log/logGenerator'
import timeService from '../../time/workTimeService'

export default ({ config, db }) => {
	let api = Router();

	// perhaps expose some API metadata at the root
	api.post('/', (req, res) => {

    const STATUS_SERVER_ERROR = 500

    const checkCurrentTime = timeService.isWorkTime();
		
    if(!checkCurrentTime.isOnWorkTime){
      const err = {
        message: 'Horário fora do expediente',
        data: checkCurrentTime.currentTime,
      }

      logService(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()

      return;
    }

    logService('Confirm request', req.body)
    
    purchaseService(req.body.addressData)
    .then((apiRes) => {

      const servicesSum = req.body.servicesData.services.reduce( (total, current ) => {
        return total + (current.value * current.amount) 
      }, 0)

      const returnMultiplier = 2
      const deliveryTax = apiRes.estimatedCost * returnMultiplier
      const purchaseData = calcService(servicesSum, deliveryTax)

      res.json(purchaseData)
      res.end()
    })
    .catch((err) => {
      res.status(STATUS_SERVER_ERROR).json(err.message)
      logService(err.message, err.object)
      res.end()
    })
	});

	return api;
}
