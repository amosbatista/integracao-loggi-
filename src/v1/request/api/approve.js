import { Router } from 'express'

import NewRequestMapper from '../mapper/new'
import RequestLog from '../log/mapper'
import RequestStatus from '../status'
import emailService from '../../email/service'
import emailHelper from '../../email/emailHelper'
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
      status: RequestStatus.WAITING_DELIVERY_RECEIVE_ORDER
    }).catch( async (err) => {
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
        "O horário de funcionamento do atendimento Delivery é de segunda a sexta-feira das 09:00 às 16:00 (exceto feriados). Pedidos realizados após às 16:00, serão realizados no dia seguinte a partir das 09:00.",
        '',
        'Seu pedido foi recebido e está em processamento.',
        'Após a finalização do serviço, enviaremos um novo e-mail, com o link para pagamento.',
        'Após a comprovação do pagamento, será enviado um novo motoboy até o endereço de solicitação para a devolução dos documentos.',
        "Caso precise tirar alguma dúvida, ou verificar alguma falha no seu pedido, favor entrar em contato pelo e-mail contato.mkt@20cartorio.com.br ou via telefone: 11 3078-1836.."
      ]
    )
    await emailService(emailContent).catch(async  (err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).send(err.message)
      res.end()
      throw new Error(err.message)
    })


    // Solicitação para o cartório
    const emailContentForNotary = emailHelper(
      "Aprovação de pedido -  Solicitação pedido", 
      '20º Cartório', 
      [
        'izabelfranco@20cartorio.com.br', 
        'paulorezende@20cartorio.com.br', 
        'contato.mkt@20cartorio.com.br',
        'amos.silva@gmail.com'
      ],
      [
        "Um cliente solicitou um serviço para o cartório:",
        `ID do pedido: ${request.id}`,
        `Nome: ${request.clientName} `,
        `Email: ${  request.clientEmail}`,
        `Endereço de retirada: ${req.body.addressData.completeAddress} - ${req.body.addressData.addressComplement}`,
        `Taxa de entrega: ${formatedValues.deliveryTax}`,
        `Total dos serviços: ${formatedValues.servicesSum}`,
        `Taxa de transação bancária: ${formatedValues.transactionOperationTax}`,
        `Total geral: ${formatedValues.totalAmount}`,
      ]
    )
    await emailService(emailContentForNotary).catch(async  (err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).send(err.message)
      res.end()
      throw new Error(err.message)
    })
    
    const requestLog = new RequestLog()
    await requestLog.save(request, RequestStatus.WAITING_DELIVERY_RECEIVE_ORDER).catch( (err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).send(err.message)
      res.end()
      return
    })
    
    res.json({
      isProcessOk: true,
      requestId: request.id
    })
    res.end()
  })

	return api;
}
