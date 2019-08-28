import { Router } from 'express'
import deliveryAuthService from '../../delivery/loggiLogin/service'

import loggiApproved from '../../delivery/loggiDeliveryTest'
import loggiCancelation from '../../delivery/loggiCancelDelivery'
import NewRequestMapper from '../mapper/new'
import RequestLog from '../log/mapper'
import RequestStatus from '../status'
import emailService from '../../email/service'
import emailHelper from '../../email/emailHelper'
import DeliveryMapper from '../../delivery/db/mappers/save'
import deliveryType from '../../delivery/db/deliveryType'

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

    const STATUS_UNAUTHORIZED = 401
    const STATUS_SERVER_ERROR = 500

    const authData = await deliveryAuthService().catch( (err) => {
      console.log('Tentativa não autorizada de concluir aprovação', err)
      res.status(STATUS_UNAUTHORIZED).send(err.message)
      res.end()
      return
    })

    const loggiData = await loggiApproved(
      req.body.addressData, 
      req.body.servicesData, 
      req.body.paymentData, 
      authData.toString()
    ).catch((err)=>{
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).send(err.message)
      res.end()
      return
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
    }).catch( (err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).send(err.message)
      res.end()
      return
    })

    const deliveryMapper = new DeliveryMapper()

    await deliveryMapper.save({
      requestId: request.id,
      deliveryId: loggiData.loggiOrderId,
      type: deliveryType.TO_RECEIVE
    }).catch( (err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).send(err.message)
      res.end()
      return
    })

    const emailContent = emailHelper(
      "Aprovação de pedido", 
      request.clientName, 
      request.clientEmail,
      [
        "Informamos que o pedido foi efetuado com sucesso. Segue os dados dele:",
        `ID do pedido: ${request.id}`,
        `Endereço de retirada: ${req.body.addressData.completeAddress} - ${req.body.addressData.addressComplement}`,
        `Taxa de entrega: ${req.body.paymentData.deliveryTax}`,
        `Total dos serviços: ${req.body.paymentData.servicesSum}`,
        `Taxa de transação bancária: ${req.body.paymentData.transactionOperationTax}`,
        `Código da transportadora: ${loggiData.loggiOrderId}`,
        `Total geral: ${req.body.paymentData.totalAmount}`,
        "Observação: Se houver qualquer diferença em relação aos serviços e à documentação enviada, o valor final será alterado."
      ]
    )
    await emailService(emailContent).catch( (err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).send(err.message)
      res.end()
      return
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
