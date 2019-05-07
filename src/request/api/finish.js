import { Router } from 'express'
import { isNull } from 'util';
import RequestMapper from '../mapper/load'
import RequestOrderMapper from '../order/mapper/new'
import RequestUpdateMapper from '../mapper/updateStatus'
import RequestStatus from '../status'
import RequestLogMapper from '../log/mapper'
import EmailService from '../../email/service'

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

      const requestOrderMapper = new RequestOrderMapper()
      const requestOrderPromise = requestOrderMapper.save(orderData, request)

      const requestUpdateMapper = new RequestUpdateMapper()
      const requestUpdatePromise = requestUpdateMapper.update(request, RequestStatus.WAITING_PAYMENT)

      const requestLogMapper = new RequestLogMapper()
      const requestLogPromise = requestLogMapper.save(request, RequestStatus.WAITING_PAYMENT)

      const emailPromise = EmailService(request.clientEmail, request.clientName, emailMessage(request, orderData))

      Promise.all([
        requestOrderPromise,
        requestUpdatePromise,
        requestLogPromise,
        emailPromise
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

  if(!body.orderData.realValue) {
    return 'Valor real está vazio'
  }

  if(isNull(body.orderData.isRealValueDifferentFromProposed)) {
    return 'O indicador de valor diferente ou igual está vazio'
  }

  if(body.orderData.isRealValueDifferentFromProposed && !body.orderData.reasonToDifference) {
    return 'O valor esta diferente, mas o motivo não foi informado.'
  }

  return null

}

const emailMessage = (request, order) => {
  return `O seu pedido está finalizado. Favor fazer o pagamento para o pedido ${request.id}. Será cobrado o valor de ${order.realValue}`
}

const errorDealer = (err, res) => {
  console.log(err.message, err.data)
  res.status(STATUS_SERVER_ERROR).send(err.message)
  res.end()
}


export default api