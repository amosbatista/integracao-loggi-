import { Router } from 'express'
import RequestListMapper from '../mapper/loadAll'

const api = ({ config, db }) => {

	let api = Router();

	api.post('/', (req, res) => {

    const requestListMapper = new RequestListMapper()
    requestListMapper.loadAll().then( (requests) => {

      // Forcing conversion values to decimal (due MYSQL2 preciosion bug)
      requests.map( (request) => {
        request.totalPurchase = Number.parseFloat(request.totalPurchase)
        request.deliveryTax = Number.parseFloat(request.deliveryTax)
        request.servicesSum = Number.parseFloat(request.servicesSum)
        request.transactionOperationTax = Number.parseFloat(request.transactionOperationTax)

        return request
      } )

      res.json(requests)
      res.end()

      return
    }).catch((err) => {errorDealer(err, res)} )
    
	});

	return api;
}

const STATUS_SERVER_ERROR = 500

const errorDealer = (err, res) => {
  console.log(err.message, err.data)
  res.status(STATUS_SERVER_ERROR).send(err.message)
  res.end()
}


export default api