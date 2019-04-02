import { Router } from 'express'
import service from './service'
import ecommerceTax from '../../taxs/transactionEcommerce'

export default ({ config, db }) => {
	let api = Router();

	// perhaps expose some API metadata at the root
	api.post('/', (req, res) => {
    const STATUS_UNAUTHORIZED = 401
    const STATUS_SERVER_ERROR = 500

    service(req).then((apiRes) => {

      const servicesSum = req.body.servicesData.services.reduce( (total, current ) => {
        return total + (current.value * current.amount) 
      }, 0)

      const taxsSum = ecommerceTax(servicesSum)
      const totalPurchase = servicesSum + taxsSum

      res.json({
        purchaseId: apiRes.body,
        serviceSum,
        taxsSum,
        totalPurchase
      })
      res.end()
    })

    .catch((error) => {

      if(error.message == 'Unauthorized'){
        res.status(STATUS_UNAUTHORIZED).send('Unauthenticated')
      } 
      else {
        res.status(STATUS_SERVER_ERROR).send(error.message)
        console.log(error.message, error.object)
      }
      res.end()
    })
	});

	return api;
}
