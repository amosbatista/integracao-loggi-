import { Router } from 'express'

import deliveryApproved from '../../delivery/clickEntregas/clickEntregasCreateOrderService'
import deliveryCancelation from '../../delivery/clickEntregas/clickEntregasCancelOrderService'
import NewRequestMapper from '../mapper/new'
import RequestLog from '../log/mapper'
import RequestStatus from '../status'
import emailService from '../../email/service'
import emailHelper from '../../email/emailHelper'
import DeliveryMapper from '../../delivery/db/mappers/save'
import deliveryType from '../../delivery/db/deliveryType'
import ServiceMapper from '../../notary/services/mapper/save'
import currencyFormat from '../../helpers/formatCurrency'
import logService from '../log/logGenerator'

export default ({ config, db }) => {

	let api = Router();

	/**
   * Autenticação
   *    Aprovação Loggi
   *        Gravar Requisição no Banco
   *          Gravar Log
   *          Enviar e-mail
   */
	api.post('/', async (req, res) => {

    const STATUS_SERVER_ERROR = 500

    logService('Approve request', req.body)
    
    const loggiData = await deliveryApproved(
      req.body.addressData, 
      req.body.servicesData, 
    ).catch((err)=>{
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).send(err.message)
      res.end()
      throw new Error(err.message)
    })

    const newRequestMapper = new NewRequestMapper()

    const request = await newRequestMapper.save({
      clientName: req.body.servicesData.clientName,
      clientEmail: req.body.servicesData.clientEmail,
      clientPhone: req.body.servicesData.clientPhone,
      completeAddress: req.body.addressData.completeAddress,
      addressComplement: req.body.addressData.addressComplement,
      addressLat: req.body.addressData.coordinates.lat,
      addressLng: req.body.addressData.coordinates.lng,
      totalPurchase: req.body.paymentData.totalAmount,
      deliveryTax: req.body.paymentData.deliveryTax,
      servicesSum: req.body.paymentData.servicesSum,
      transactionOperationTax: req.body.paymentData.transactionOperationTax,
      status: RequestStatus.AT_RECEIVE
    }).catch( async (err) => {
      console.log(err.message, err.data)
      await deliveryCancelation(loggiData.loggiOrderId)
      res.status(STATUS_SERVER_ERROR).send(err.message)
      res.end()
      throw new Error(err.message)
    })

    const deliveryMapper = new DeliveryMapper()

    await deliveryMapper.save({
      requestId: request.id,
      deliveryId: loggiData.loggiOrderId,
      packageId: loggiData.packageId,
      type: deliveryType.TO_RECEIVE
    }).catch( async (err) => {
      await deliveryCancelation(loggiData.loggiOrderId, loggiData.packageId, authData)
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).send(err.message)
      res.end()
      throw new Error(err.message)
    })

    const serviceMapper = new ServiceMapper()
    const requestServicesSavePromises = req.body.servicesData.services.map( async (service)=> {

      return new Promise( async (resolve, reject) => {
        await serviceMapper.save(request.id, service).catch( (err) => {
          reject(err)
        })

        resolve()
      })
    })

    await Promise.all(requestServicesSavePromises).catch(async (err) => {
      await deliveryCancelation(loggiData.loggiOrderId, loggiData.packageId, authData)
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).send(err.message)
      res.end()
      throw new Error(err.message)
    })

    const formatedValues = {
      deliveryTax: currencyFormat(req.body.paymentData.deliveryTax),
      servicesSum: currencyFormat(req.body.paymentData.servicesSum),
      transactionOperationTax: currencyFormat(req.body.paymentData.transactionOperationTax),
      totalAmount: currencyFormat(req.body.paymentData.totalAmount)
    }
    const emailContent = emailHelper(
      "Aprovação de pedido", 
      request.clientName, 
      request.clientEmail,
      [
        "Informamos que o pedido foi efetuado com sucesso. Segue os dados dele:",
        `ID do pedido: ${request.id}`,
        `Endereço de retirada: ${req.body.addressData.completeAddress} - ${req.body.addressData.addressComplement}`,
        `Taxa de entrega: ${formatedValues.deliveryTax}`,
        `Total dos serviços: ${formatedValues.servicesSum}`,
        `Taxa de transação bancária: ${formatedValues.transactionOperationTax}`,
        `Código da transportadora: ${loggiData.loggiOrderId}`,
        `Total geral: ${formatedValues.totalAmount}`,
        "Observação: Se houver qualquer diferença em relação aos serviços e à documentação enviada, o valor final será alterado."
      ]
    )
    await emailService(emailContent).catch(async  (err) => {
      await deliveryCancelation(loggiData.loggiOrderId, loggiData.packageId, authData)
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).send(err.message)
      res.end()
      throw new Error(err.message)
    })
    
    const requestLog = new RequestLog()
    await requestLog.save(request, RequestStatus.AT_RECEIVE).catch( (err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).send(err.message)
      res.end()
      return
    })
    
    res.json({
      isProcessOk: true,
      loggiOrderId: loggiData.loggiOrderId,
      requestId: request.id
    })
    res.end()
  })

	return api;
}
