import { Router } from 'express'
import RequestMapper from '../mapper/load'
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
    
    requestMapper.load(body.requestId).then( (request) => {

      if(!request) {
        res.status(STATUS_INVALID_REQUEST).send("Pedido não existe")
        res.end()

        return
      }

      const requestUpdateMapper = new RequestUpdateMapper()
      const requestUpdatePromise = requestUpdateMapper.update(request, RequestStatus.RETURNED)

      const requestLogMapper = new RequestLogMapper()
      const requestLogPromise = requestLogMapper.save(request, RequestStatus.RETURNED)

      const emailPromise = EmailService(request.clientEmail, request.clientName, emailMessage(request))

      Promise.all([
        requestUpdatePromise,
        requestLogPromise,
        emailPromise
      ]).then(()=> {
        res.status(STATUS_REQUEST_ACCEPT).send()
        res.end()

        return
      })
      .catch(errorDealer(err, res))

    })
	});

	return api;
}

const validateBody = (body) => {

  if(!body.requestId) {
    return 'ID do pedido está vazio'
  }

  return null
}

const emailMessage = (request) => {
  return `O seu pedido acabou de sair em direção ao seu destino.`
}

const errorDealer = (err, res) => {
  console.log(err.message, err.data)
  res.status(STATUS_SERVER_ERROR).send(err.message)
  res.end()
}

export default api