import { Router } from 'express'

import RequestListMapper from '../mapper/basicLoadWithFilters'
import deliveryStatusService from '../../delivery/clickEntregas/clickEntregasLoadOrderService'
//import deliveryStatusService from '../../delivery/clickEntregas/clickEntregasLoadOrderServiceMock'

import RequestUpdateMapper from '../mapper/updateStatus'

import deliveryTypes from '../../delivery/db/deliveryType'
import requestStatus from '../status'
import TokenService from '../../auth/cripto/JWTTokenService';
import userTypes from '../../auth/db/types';
import types from '../../auth/db/types'

const STATUS_SERVER_ERROR = 500

const api = ({ config, db }) => {

	let api = Router();

	api.post('/', async (req, res) => {

    const PAGE_LIMIT = 10

    const token = req.header("Authorization");
    const userRequest = await isUserAnAdmin(token).catch((err) => {
      const message = 'Erro ao verificar permissões do ususário.'
      console.log(message, err)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(message)
    });
    
    const requestListMapper = new RequestListMapper()
    const requestFilters = {
      atReceive: req.body.atReceiveRequests,
      atFinish: req.body.atFinishRequests,
      waitingPayment: req.body.waitingPaymentRequests,
      readyToReturn: req.body.readyRequests,
      returned: req.body.returnedRequests,
      query: req.body.query,
    };
    const requestsWithTotal = await requestListMapper.load(
      requestFilters,
      req.body.pageNumber ? req.body.pageNumber : 0,
      PAGE_LIMIT,
      userRequest.userType == userTypes.COMMON ? userRequest.id : null,
    ).catch((err) => {errorDealer(err, res)} );

    const requests = requestsWithTotal.records;

    const requestsWithTransaction = requests.map( (request) => {
      request.totalPurchase = Number.parseFloat(request.totalPurchase)
      request.deliveryTax = Number.parseFloat(request.deliveryTax)
      request.servicesSum = Number.parseFloat(request.servicesSum)
      request.transactionOperationTax = Number.parseFloat(request.transactionOperationTax)

      return request
    });

    const reqUpdateMapper = new RequestUpdateMapper()

    const requestWithDeliveryPromises = requestsWithTransaction.map( (request) => {

      return new Promise(async (resolve, reject) => {
        request.delivery = {

          toReceive: {
            requestId: request.id,
            deliveryId: request["deliveryReceive_deliveryId"],
            type: deliveryTypes.TO_RECEIVE,
            packageId: request["deliveryReceive_packageId"],
            createdAt: request["deliveryReceive_createdAt"],
          },
          toReturn: {
            requestId: request.id,
            deliveryId: request["deliveryReturn_deliveryId"],
            type: deliveryTypes.TO_RETURN,
            packageId: request["deliveryReturn_packageId"],
            createdAt: request["deliveryReturn_createdAt"],
          }
        }

        request.delivery.status = {
          name: "unknown",
          translated: "Desconhecido"
        }
        if(request.status == requestStatus.AT_RECEIVE){
          const deliveryStatus = await deliveryStatusService(request.delivery.toReceive.deliveryId).catch( (err) => {
            console.log(err.message, err.data)
            return {
              name: "unknown",
              translated: "Desconhecido"
            }
        })

          request.delivery.status = deliveryStatus;
        }
        if(request.status == requestStatus.READY_TO_RETURN){
          const deliveryStatus = await deliveryStatusService(request.delivery.toReturn.deliveryId).catch( (err) => {
            console.log(err.message, err.data)
            return {
              name: "unknown",
              translated: "Desconhecido"
            }
        })

          request.delivery.status = deliveryStatus;
        }


        if(request.status == requestStatus.RETURNED) {

          if(request.delivery.status.name == 'completed' || 
            request.delivery.status.name == 'canceled' ||
            request.delivery.status.name == 'draft' ||
            request.delivery.status.name == 'unknown') {
              await reqUpdateMapper.update(request, requestStatus.FINISHED).catch((err) => {errorDealer(err, res)} );
              request.status = requestStatus.FINISHED
          }
        }
        

        request.orderData = {
          proposedValue: request.proposedValue,
          realValue: request.realValue,
          realServiceValue: request.realServiceValue,
          isRealValueDifferentFromProposed: request.isRealValueDifferentFromProposed,
          reasonToDifference: request.reasonToDifference,
          isOrderComplete: request.isOrderComplete
        }

        request.user = {
          isOperator: userRequest.userType == types.OPERATOR
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

    res.json({
      requests: requestWithServiceList,
      meta: {
        maxPages: Math.floor(requestsWithTotal.recordsCount[0].total / PAGE_LIMIT) + 1
      }
    })
    res.end()

    return
    
	});

	return api;
}


const isUserAnAdmin = async (token) => {
  const tokenService = new TokenService();
  const decoded = await tokenService.verify(token).catch((err) => {
    throw new Error(err)
  });

  return decoded;
}

const errorDealer = (err, res) => {
  console.log(err.message, err.data)
  res.status(STATUS_SERVER_ERROR).json(err.message)
  res.end()
}


export default api