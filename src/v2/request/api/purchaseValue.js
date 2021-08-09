import { Router } from 'express'
import RequestMapper from '../mapper/load'

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

    const STATUS_REQUEST_ACCEPT = 200
    const STATUS_INVALID_REQUEST = 400

    const validateBodyErrors = validateBody(req.body)

    if(validateBodyErrors){
      res.status(STATUS_INVALID_REQUEST).json(validateBodyErrors)
      res.end()

      return
    }

    const requestMapper = new RequestMapper()
    
    const request = await requestMapper.load(req.body.requestId)

    if(!request) {
      res.status(STATUS_INVALID_REQUEST).json("Pedido não existe")
      res.end()

      return
    }
    
    res.status(STATUS_REQUEST_ACCEPT).json(request.dataValues.totalPurchase)
    res.end()
	});

	return api;
}


const validateBody = (body) => {

  if(!body.requestId) {
    return 'ID do pedido está vazio'
  }

  return null

}