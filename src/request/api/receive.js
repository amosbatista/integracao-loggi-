import { Router } from 'express'

import UpdateStatusMappper from '../mapper/updateStatus'
import LoadMappper from '../mapper/load'
import email from '../../email/service'
import requestStatus from '../status'
import LogMapper from '../log/mapper/new'

export default ({ config, db }) => {
	let api = Router();

	api.post('/', (req, res) => {
    
    const STATUS_SERVER_ERROR = 500
    const STATUS_INVALID_REQUEST = 400
    const STATUS_REQUEST_ACCEPT = 202

    if(!req.body.requestId) {
      res.status(STATUS_INVALID_REQUEST).send("ID do pedido está vazio")
      res.end()

      return
    }

    const loadMapper = new LoadMappper()

    loadMapper.load(requestId).then( (request) => {

      if(!request){
        res.status(STATUS_INVALID_REQUEST).send("Pedido não foi localizado na base de dados")
        res.end()

        return
      }

      const updateStatusMapper = new UpdateStatusMappper()
      const updateStatusPromise = updateStatusMapper.update(request, requestStatus.AT_FINISH)

      const emailSendPromise = email(request.clientEmail, request.clientName, "Seu pedido foi recebido e está em processamento.")

      const logMapper = new LogMapper()
      const logPromise = logMapper.save(request, requestStatus.AT_FINISH)
      
      Promise.all([
        updateStatusPromise,
        emailSendPromise,
        logPromise
      ])
      .then( () => {
        res.status(STATUS_REQUEST_ACCEPT)
        res.end()
      })
      .catch( (err) => {
        console.log(err.message, err.data)
        res.status(STATUS_SERVER_ERROR).send(err.message)
        res.end()
      })

    }).catch( (err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).send(err.message)
      res.end()
    })
  })

	return api;
}
