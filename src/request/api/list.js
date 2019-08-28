import { Router } from 'express'
import RequestListMapper from '../mapper/loadAll'
import DeliveryLoadMapper from '../../delivery/db/mappers/load'
import deliveryTypes from '../../delivery/db/deliveryType'

const api = ({ config, db }) => {

	let api = Router();

	api.post('/', async (req, res) => {

    const requestListMapper = new RequestListMapper()

    // Forcing conversion values to decimal (due MYSQL2 preciosion bug)
    const requests = await requestListMapper.loadAll().catch((err) => {errorDealer(err, res)} );

    const requestsWithTransaction = requests.map( (request) => {
      request.totalPurchase = Number.parseFloat(request.totalPurchase)
      request.deliveryTax = Number.parseFloat(request.deliveryTax)
      request.servicesSum = Number.parseFloat(request.servicesSum)
      request.transactionOperationTax = Number.parseFloat(request.transactionOperationTax)

      return request
    });

    const deliveryLoadMapper = new DeliveryLoadMapper()

    const requestWithDeliveryPromises = requestsWithTransaction.map( (request) => {

      return new Promise(async (resolve, reject) => {

        const deliveryData = await deliveryLoadMapper.load(request.id).catch((err)=>{
          reject(err)
        })

        request.dataValues.delivery = {
          toReceive: deliveryData.find((delivery)=> {
            return delivery.type == deliveryTypes.TO_RECEIVE
          }) || {
            requestId: null,
            deliveryId: null,
            type: null
          },
          toReturn: deliveryData.find((delivery)=> {
            return delivery.type == deliveryTypes.TO_RETURN
          }) || {
            requestId: null,
            deliveryId: null,
            type: null
          }
        }
        resolve(request)
      }) 
    })
    
    const requestWithDelivery = await Promise.all(requestWithDeliveryPromises)
      
    res.json(requestWithDelivery)
    res.end()

    return
    
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