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

const api = ({ config, db }) => {

	let api = Router();

	api.post('/', (req, res) => {

    const STATUS_INVALID_REQUEST = 400
    const STATUS_REQUEST_ACCEPT = 202
    const validateBodyErrors = validateBody(req.body)

    if(validateBodyErrors){
      res.status(STATUS_INVALID_REQUEST).send(validateBodyErrors)
      res.end()

      return
    }

    const requestMapper = new RequestMapper()
    
    requestMapper.load(req.body.requestId).then( (request) => {

      if(!request) {
        res.status(STATUS_INVALID_REQUEST).send("Pedido não existe")
        res.end()

        return
      }

      let orderData = req.body.orderData
      orderData.proposedValue = request.totalPurchase
      orderData.isOrderComplete = false
      orderData.requestId = request.id

      const totalRealValueData = requestNewValueCalculator(orderData.realServiceValue, request.deliveryTax)
      console.log(totalRealValueData)

      const requestOrderMapper = new RequestOrderMapper()
      const requestOrderPromise = requestOrderMapper.save(orderData, request)

      const requestUpdateValuesMapper = new RequestUpdateValuesMapper()
      const requestUpdateValuesPromise = requestUpdateValuesMapper.update(
        request, 
        orderData.realServiceValue, 
        totalRealValueData.totalPurchase, 
        totalRealValueData.transactionOperationTax.calculedValue
      )

      const requestUpdateStatusMapper = new RequestUpdateStatusMapper()
      const requestUpdateStatusPromise = requestUpdateStatusMapper.update(request, RequestStatus.WAITING_PAYMENT)

      const requestLogMapper = new RequestLogMapper()
      const requestLogPromise = requestLogMapper.save(request, RequestStatus.WAITING_PAYMENT)

      const emailContent = emailHelper(
        "Finalização de pedido",
        request.clientName,
        request.clientEmail,
        [
          `O seu pedido está finalizado!`,
          `ID do pedido: ${request.id}`,
          `Para poder recebẽ-lo de volta, você deve realizar o pagamento. Clique no link abaixo para visualizar o formulário onde você informará os dados de pagamento:`,
          `<a href="http://20cartorio.com.br/integracao-loggi/#/payment/${request.id}"> <strong>http://20cartorio.com.br/integracao-loggi/#/payment/${request.id}</strong> </a>`
        ]
      )
      const emailPromise = EmailService(emailContent)

      Promise.all([
        requestOrderPromise,
        requestUpdateStatusPromise,
        requestLogPromise,
        emailPromise,
        requestUpdateValuesPromise
      ]).then(()=> {
        res.status(STATUS_REQUEST_ACCEPT).send()
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

  if(!body.orderData.realServiceValue) {
    return 'Valor de serviço real está vazio'
  }

  if(Number.isNaN( body.orderData.realServiceValue)) {
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

const errorDealer = (err, res) => {
  console.log(err.message, err.data)
  res.status(STATUS_SERVER_ERROR).send(err.message)
  res.end()
}


export default api