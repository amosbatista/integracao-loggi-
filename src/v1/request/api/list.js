import { Router } from 'express'

import RequestListMapper from '../mapper/loadAllByMysql'
import deliveryStatusService from '../../delivery/loggiDeliveryStatusService'

import deliveryTypes from '../../delivery/db/deliveryType'
import deliveryAuthService from '../../delivery/loggiLogin/service'
import requestStatus from '../status'

const api = ({ config, db }) => {

	let api = Router();

	api.post('/', async (req, res) => {

    const STATUS_UNAUTHORIZED = 401

    const authData = await deliveryAuthService().catch( (err) => {
      const message = 'Tentativa não autorizada de listar pedidos'
      console.log(message, err)
      res.status(STATUS_UNAUTHORIZED).send(err.message)
      res.end()
      throw new Error(message)
    })

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

    const requestWithDeliveryPromises = requestsWithTransaction.map( (request) => {

      return new Promise(async (resolve, reject) => {
        request.delivery = {

          toReceive: {
            requestId: request.id,
            deliveryId: request["deliveryReceive_deliveryId"],
            type: deliveryTypes.TO_RECEIVE,
            packageId: request["deliveryReceive_packageId"],
          },
          toReturn: {
            requestId: request.id,
            deliveryId: request["deliveryReturn_deliveryId"],
            type: deliveryTypes.TO_RETURN,
            packageId: request["deliveryReturn_packageId"],
          }
        }

        request.delivery.status = {
          name: "unknown",
          translated: "Desconhecido"
        }
        if(request.status == requestStatus.AT_RECEIVE){
          const deliveryStatus = await deliveryStatusService(request.delivery.toReceive.packageId, authData)

          request.delivery.status = deliveryStatus;
        }
        if(request.status == requestStatus.READY_TO_RETURN){
          const deliveryStatus = await deliveryStatusService(request.delivery.toReturn.packageId, authData)

          request.delivery.status = deliveryStatus;
        }

        request.orderData = {
          proposedValue: request.proposedValue,
          realValue: request.realValue,
          realServiceValue: request.realServiceValue,
          isRealValueDifferentFromProposed: request.isRealValueDifferentFromProposed,
          reasonToDifference: request.reasonToDifference,
          isOrderComplete: request.isOrderComplete
        }

        resolve(request)
      }) 
    })
    
    const requestWithDelivery = await Promise.all(requestWithDeliveryPromises)

    const requestWithServiceList = requestWithDelivery.reduce( (total, request) => {

      const lastRequestIndex = total.findIndex( (addedRequest ) => {
        return addedRequest.id == request.id
      })

      if(lastRequestIndex < 0){
  
        request.serviceData = [{
          serviceId: request.serviceId,
          amount: request.amount,
          value: request.value,
          totalValue: request.totalValue,
          text: request.text
        }]

        total.push (request)
      }
      else{
        total[lastRequestIndex].serviceData.push({
          serviceId: request.serviceId,
          amount: request.amount,
          value: request.value,
          totalValue: request.totalValue,
          text: request.text
        })
      }

      return total
      
    }, [])
      
    res.json(requestWithServiceList)
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