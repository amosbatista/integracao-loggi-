import { Router } from 'express'

import deliveryApproved from '../../delivery/clickEntregas/clickEntregasCreateOrderService'
//import deliveryApproved from '../../delivery/clickEntregas/clickEntregasCreateOrderServiceMock'
import deliveryCancelation from '../../delivery/clickEntregas/clickEntregasCancelOrderService'

import RequestMapper from '../mapper/load'
import RequestStatusUpdateMapper from '../mapper/updateStatus'
import RequestLogMapper from '../log/mapper'
import RequestStatus from '../status'

import emailService from '../../email/service'
import emailHelper from '../../email/emailHelper'
import DeliveryMapper from '../../delivery/db/mappers/save'
import deliveryType from '../../delivery/db/deliveryType'

export default ({ config, db }) => {

	let api = Router();

	api.post('/', async (req, res) => {

    const STATUS_SERVER_ERROR = 500


    const requestListMapper = new RequestMapper()
    const request = await requestListMapper.load(req.body.requestId).catch((err) => {errorDealer(err, res)} );

    const deliveryData = await deliveryApproved(
      {
        addressComplement: request.addressComplement,
        completeAddress: request.completeAddress,
      }, {
        clientName: request.clientName,
        clientPhone: request.clientPhone
      }, 
    ).catch((err)=>{
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).send(err.message)
      res.end()
      throw new Error(err.message)
    });


    const deliveryMapper = new DeliveryMapper()

    await deliveryMapper.save({
      requestId: request.id,
      deliveryId: deliveryData.loggiOrderId,
      packageId: deliveryData.packageId,
      type: deliveryType.TO_RECEIVE
    }).catch( async (err) => {
      await deliveryCancelation(deliveryData.loggiOrderId, deliveryData.packageId, authData)
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).send(err.message)
      res.end()
      throw new Error(err.message)
    })


    const requestStatusUpdateMapper = new RequestStatusUpdateMapper()
		await requestStatusUpdateMapper.update(request, RequestStatus.AT_RECEIVE).catch( async (err) => {
      await deliveryCancelation(deliveryData.loggiOrderId, deliveryData.packageId, authData)
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).send(err.message)
      res.end()
      throw new Error(err.message)
    })

    const requestLogMapper = new RequestLogMapper()
		await requestLogMapper.save(request, RequestStatus.AT_RECEIVE).catch( async (err) => {
      await deliveryCancelation(deliveryData.loggiOrderId, deliveryData.packageId, authData)
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).send(err.message)
      res.end()
      throw new Error(err.message)
    })

    const emailContent = emailHelper(
      "Delivery solicitado para retirar documento.", 
      request.clientName, 
      request.clientEmail,
      [
        "Informamos que o delivery foi acionado para retirar o seu pedido. Segue os dados dele:",
        `ID do pedido: ${request.id}`,
        `Endereço de retirada: ${request.completeAddress} - ${request.addressComplement}`,
        `Código da transportadora: ${deliveryData.loggiOrderId}`,
        "Aguarde no endereço até o motoboy chegar."
      ]
    )
    await emailService(emailContent).catch(async  (err) => {
      await deliveryCancelation(deliveryData.loggiOrderId, deliveryData.packageId)
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).send(err.message)
      res.end()
      throw new Error(err.message)
    })

    res.json({
      orderId: deliveryData.loggiOrderId
    })
    res.end()
  });

  const errorDealer = (err, res) => {
    console.log(err.message, err.data)
    res.status(STATUS_SERVER_ERROR).send(err.message)
    res.end()
  }

  return api
}
