import { Router } from 'express'
import { isNull } from 'util';
import RequestMapper from '../mapper/load'
import RequestOrderMapper from '../order/mapper/new'
import RequestUpdateStatusMapper from '../mapper/updateStatus'
import RequestStatus from '../status'
import RequestLogMapper from '../log/mapper'
import EmailService from '../../email/service'
import requestNewValueCalculator from '../purchaseCalculator'
import RequestUpdateValuesMapper from '../mapper/updateValues'
import emailHelper from '../../email/emailHelper'
import currencyFormat from '../../helpers/formatCurrency'
import logService from '../log/logGenerator'

const api = ({ config, db }) => {

	let api = Router();

	api.post('/', (req, res) => {

    const STATUS_INVALID_REQUEST = 400
    const STATUS_REQUEST_ACCEPT = 202

    logService('Finish request', req.body)
    
    const validateBodyErrors = validateBody(req.body)

    if(validateBodyErrors){
      res.status(STATUS_INVALID_REQUEST).json(validateBodyErrors)
      res.end()

      throw new Error(err.message)
    }

    const requestMapper = new RequestMapper()
    
    requestMapper.load(req.body.requestId).then( (request) => {

      if(!request) {
        res.status(STATUS_INVALID_REQUEST).json("Pedido não existe")
        res.end()

        throw new Error(err.message)
      }

      let orderData = req.body.orderData
      orderData.proposedValue = request.totalPurchase
      orderData.isOrderComplete = false
      orderData.requestId = request.id
      orderData.realServiceValue = orderData.isRealValueDifferentFromProposed ? 
        req.body.orderData.realServiceValue : 
        request.servicesSum

      var totalRealValueData

      if(orderData.isRealValueDifferentFromProposed){
        totalRealValueData = requestNewValueCalculator(orderData.realServiceValue, request.deliveryTax)
      }
      else{
        totalRealValueData = {
          totalPurchase: request.totalPurchase,
          transactionOperationTax: {
            taxValue: request.transactionOperationTax
          }
        }
      }

      console.log(request)

      const requestOrderMapper = new RequestOrderMapper()
      const requestOrderPromise = requestOrderMapper.save(orderData, request)

      const requestUpdateValuesMapper = new RequestUpdateValuesMapper()
      const requestUpdateValuesPromise = requestUpdateValuesMapper.update(
        request, 
        orderData.realServiceValue, 
        totalRealValueData.totalPurchase, 
        totalRealValueData.transactionOperationTax.taxValue
      )

      const requestUpdateStatusMapper = new RequestUpdateStatusMapper()
      const requestUpdateStatusPromise = requestUpdateStatusMapper.update(request, RequestStatus.WAITING_PAYMENT)

      const requestLogMapper = new RequestLogMapper()
      const requestLogPromise = requestLogMapper.save(request, RequestStatus.WAITING_PAYMENT)
      
      const formatedValues = {
        realServiceValue: currencyFormat(orderData.realServiceValue),
        totalPurchase: currencyFormat(totalRealValueData.totalPurchase)
      }
      const emailBody = request.isRealValueDifferentFromProposed ?
        [
          `O seu pedido está finalizado!`,
          `ID do pedido: ${request.id}`,
          `<strong>Valor do serviço: </strong>${formatedValues.realServiceValue}`,
          `<strong>Valor total: </strong>${formatedValues.totalPurchase}`,
          `Para poder recebẽ-lo de volta, você deve realizar o pagamento. Clique no link abaixo para visualizar o formulário onde você informará os dados de pagamento:`,
          `<a href="https://20cartorio.com.br/delivery/#/payment/${request.id}"> <strong>https://20cartorio.com.br/delivery/#/payment/${request.id}</strong> </a>`
        ] : 
        [
          `O seu pedido está finalizado!`,
          `ID do pedido: ${request.id}`,
          `<strong>Houve alterações no valor!!</strong>`,
          `<strong>O novo valor do serviço ficou em: </strong>${formatedValues.realServiceValue}`,
          `<strong>Novo valor total: </strong>${formatedValues.totalPurchase}`,
          `<strong>Motivo da mudança: </strong>${req.body.orderData.reasonToDifference}`,
          `Para poder recebẽ-lo de volta, você deve realizar o pagamento. Clique no link abaixo para visualizar o formulário onde você informará os dados de pagamento:`,
          `<a href="https://20cartorio.com.br/delivery/#/payment/${request.id}"> <strong>https://20cartorio.com.br/delivery/#/payment/${request.id}</strong> </a>`
        ]

      const emailContent = emailHelper(
        "Finalização de pedido",
        request.clientName,
        request.clientEmail,
        emailBody
      )
      const emailPromise = EmailService(emailContent)

      Promise.all([
        emailPromise,
        requestOrderPromise,
        requestUpdateStatusPromise,
        requestLogPromise,
        requestUpdateValuesPromise
      ]).then(()=> {
        res.status(STATUS_REQUEST_ACCEPT).json()
        res.end()

        return
      })
      .catch((err) => {errorDealer(err, res)} )

    }).catch((err) => {errorDealer(err, res)} )
	});

	return api;
}


const validateBody = (body) => {

  if(!body.requestId) {
    return 'ID do pedido está vazio'
  }

  if(!body.orderData) {
    return 'Dados de compra está vazio'
  }

  if(!body.orderData.realServiceValue && body.orderData.isRealValueDifferentFromProposed) {
    return 'Valor de serviço real está vazio'
  }

  if(body.orderData.isRealValueDifferentFromProposed && Number.isNaN( body.orderData.realServiceValue)) {
    return 'Valor de serviço deve ser numérico'
  }

  if(isNull(body.orderData.isRealValueDifferentFromProposed)) {
    return 'O indicador de valor diferente ou igual está vazio'
  }

  if(body.orderData.isRealValueDifferentFromProposed && !body.orderData.reasonToDifference) {
    return 'O valor esta diferente, mas o motivo não foi informado.'
  }

  return null

}

const STATUS_SERVER_ERROR = 500

const errorDealer = (err, res) => {
  console.log(err.message, err.data)
  res.status(STATUS_SERVER_ERROR).json(err.message)
  res.end()
  throw new Error(err.message)
}


export default api