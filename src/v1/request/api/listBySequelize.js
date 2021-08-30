import { Router } from 'express'

import RequestListMapper from '../mapper/loadAll'
import DeliveryLoadMapper from '../../delivery/db/mappers/load'
import ServicesMapper from '../../notary/services/mapper/loadAll'
import RequestOrderMapper from '../order/mapper/load'
import deliveryStatusService from '../../delivery/clickEntregas/clickEntregasLoadOrderService'

import deliveryTypes from '../../delivery/db/deliveryType'
import requestStatus from '../status'

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
    const servicesMapper = new ServicesMapper()

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
            type: null,
            packageId: null
          },
          toReturn: deliveryData.find((delivery)=> {
            return delivery.type == deliveryTypes.TO_RETURN
          }) || {
            requestId: null,
            deliveryId: null,
            type: null,
            packageId: null
          }
        }

        request.dataValues.delivery.status = {
          name: "unknown",
          translated: "Desconhecido"
        }
        if(request.status == requestStatus.AT_RECEIVE){
          const deliveryStatus = await deliveryStatusService(request.dataValues.delivery.toReceive.deliveryId)

          request.dataValues.delivery.status = deliveryStatus;
        }
        if(request.status == requestStatus.READY_TO_RETURN){
          const deliveryStatus = await deliveryStatusService(request.dataValues.delivery.toReturn.deliveryId)

          request.dataValues.delivery.status = deliveryStatus;
        }

        request.dataValues.serviceData = await servicesMapper.loadAll(request.id) || []

        const requestOrderMapper = new RequestOrderMapper()
        request.dataValues.orderData = await requestOrderMapper.load(request.id).catch( (err) => {
          reject(err)
        })  || {}

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