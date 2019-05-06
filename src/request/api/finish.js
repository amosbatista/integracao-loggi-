import { Router } from 'express'
import { isNull } from 'util';
import RequestMapper from '../mapper/load'
import RequestOrderMapper from '../order/mapper'
import RequestUpdateMapper from '../mapper/updateStatus'
import RequestStatus from '../status'

const api = ({ config, db }) => {

	let api = Router();

	api.post('/', (req, res) => {

    const STATUS_INVALID_REQUEST = 400
    const validateBodyErrors = validateBody(req.body)

    if(validateBodyErrors){
      res.status(STATUS_INVALID_REQUEST).send("ID do pedido está vazio")
      res.end()

      return
    }

    const requestMapper = new RequestMapper()
    
    requestMapper.load(body.requestId).then( (request) => {

      if(!request) {
        res.status(STATUS_INVALID_REQUEST).send("Pedido não existe")
        res.end()

        return
      }

      const orderData = req.body.orderData
      orderData.proposedValue = request.totalPurchase

      const requestOrderMapper = new RequestOrderMapper()
      requestOrderMapper.save(orderData, request).then ( () => {
        
        const requestUpdateMapper = new RequestUpdateMapper()
        requestUpdateMapper.update(request, RequestStatus.WAITING_PAYMENT)
      })

    })
    

    
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

export default api