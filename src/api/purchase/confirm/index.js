import { Router } from 'express'
import purchaseService from './service'
import authService from '../../login/service'
import ecommerceTax from '../../taxs/transactionEcommerce'

export default ({ config, db }) => {
	let api = Router();

	// perhaps expose some API metadata at the root
	api.post('/', (req, res) => {
    const STATUS_UNAUTHORIZED = 401
    const STATUS_SERVER_ERROR = 500

    authService().then( (authData) => {
      purchaseService(req.body.addressData, authData.toString())
      .then((apiRes) => {

        const servicesSum = req.body.servicesData.services.reduce( (total, current ) => {
          return total + (current.value * current.amount) 
        }, 0)

        const taxsSum = ecommerceTax(servicesSum)
        const totalPurchase = servicesSum + taxsSum.calculedValue

        res.json({
          purchaseId: apiRes.newRequestId,
          servicesSum,
          taxsSum,
          totalPurchase
        })
        res.end()
      })
      .catch((err) => {
        res.status(STATUS_SERVER_ERROR).send(err.message)
        console.log(err.message, err.object)
        res.end()
      })

    }).catch( (err) => {
      console.log(err.message, err.data)
      res.status(STATUS_UNAUTHORIZED).send(err.message)
      res.end()
    })
	});

	return api;
}
