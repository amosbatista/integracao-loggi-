import { Router } from 'express'
import RequestMapper from '../mapper/load'
import RequestUpdateMapper from '../mapper/updateStatus'
import RequestStatus from '../status'
import RequestLogMapper from '../log/mapper'
import EmailService from '../../email/service'
import emailHelper from '../../email/emailHelper'

const api = ({ config, db }) => {

	let api = Router();

	api.post('/', (req, res) => {

    const STATUS_INVALID_REQUEST = 400
    const STATUS_REQUEST_ACCEPT = 202
    const validateBodyErrors = validateBody(req.body)

    if(validateBodyErrors){
      res.status(STATUS_INVALID_REQUEST).json(validateBodyErrors)
      res.end()

      return
    }

    const requestMapper = new RequestMapper()
    
    requestMapper.load(req.body.requestId).then( (request) => {

      if(!request) {
        res.status(STATUS_INVALID_REQUEST).json("Pedido não existe")
        res.end()

        return
      }

      const requestUpdateMapper = new RequestUpdateMapper()
      const requestUpdatePromise = requestUpdateMapper.update(request, RequestStatus.RETURNED)

      const requestLogMapper = new RequestLogMapper()
      const requestLogPromise = requestLogMapper.save(request, RequestStatus.RETURNED)

      const emailContent = emailHelper(
        "Retorno do pedido",
        request.clientName,
        request.clientEmail,
        [
          `O pagamento foi confirmado!`,
          `ID do pedido: ${request.id}`,
          `Seus documentos estão retornando para você.`,
          `Muito obrigado por utilizar nossos serviços.`,
        ]
      )
      const emailPromise = EmailService(emailContent)

      Promise.all([
        requestUpdatePromise,
        requestLogPromise,
        emailPromise
      ]).then(()=> {
        res.status(STATUS_REQUEST_ACCEPT).json()
        res.end()

        return
      })
      .catch((err) => {errorDealer(err, res)} )

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

const errorDealer = (err, res) => {
  console.log(err.message, err.data)
  res.status(STATUS_SERVER_ERROR).json(err.message)
  res.end()
}

export default api