import { Router } from 'express'

import TokenService from '../../auth/cripto/JWTTokenService';

import RequestLoadMapper from '../../request/mapper/load';
import RequestUpdateMapper from '../../request/mapper/updateStatus';
import RequestStatuses from '../../request/status';

import DeliveryLoadMapper from '../../delivery/db/mappers/load';
import DeliveryStatuses from '../../delivery/db/deliveryType';
import DeliveryCompanyLoadOrderService from '../../delivery/clickEntregas/clickEntregasLoadOrderService';
//import DeliveryCompanyLoadOrderService from '../../delivery/clickEntregas/clickEntregasLoadOrderServiceMock';
import DeliveryCompanyCanceldOrderService from '../../delivery/clickEntregas/clickEntregasCancelOrderService';
//import DeliveryCompanyCanceldOrderService from '../../delivery/clickEntregas/clickEntregasCancelOrderServiceMock';

import emailService from '../../email/service'
import emailHelper from '../../email/emailHelper'

export default ({ config, db }) => {

	let api = Router();

	api.post('/', async (req, res) => {
    const STATUS_UNAUTHORIZED = 401;
    const STATUS_INVALID_REQUEST = 400
    const STATUS_REQUEST_ACCEPT = 202
    const STATUS_SEE_OTHER = 303
    const STATUS_SERVER_ERROR = 500

    
    const token = req.header("Authorization");
    const tokenService = new TokenService();
    
    const userFromToken = await tokenService.verify(token).catch((err) => {
      const message = 'Erro de autenticação'
      console.log(message, err)
      res.status(STATUS_UNAUTHORIZED).json(err)
      res.end()

      throw new Error(message)
    });
    
    if(!req.body.requestId) {
      const message = 'Request Id obrigatório'
      console.log(message, err)
      res.status(STATUS_INVALID_REQUEST).json(err)
      res.end()

      throw new Error(message)
    }
    const requestId = req.body.requestId;
    
    
    const requestLoadMapper = new RequestLoadMapper();
    const requestData = await requestLoadMapper.load(requestId).catch(err => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()

      throw new Error(err.message)
    });
    
    if(requestData.status == RequestStatuses.CANCELED) {
      const message = 'O serviço já foi cancelado.'
      console.log(message)
      res.status(STATUS_INVALID_REQUEST).json(message)
      res.end()

      throw new Error(message)
    }
    
    if(requestData.status != RequestStatuses.AT_RECEIVE) {
      const message = 'Só é permitido cancelar o serviço antes dos documentos chegarem ao cartório.'
      console.log(message)
      res.status(STATUS_INVALID_REQUEST).json(message)
      res.end()

      throw new Error(message)
    }
    
    
    const deliveryLoadMapper = new DeliveryLoadMapper();
    const deliveryDbList = await deliveryLoadMapper.load(requestId).catch(err => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()

      throw new Error(err.message)
    });
    const deliveryReceiveDataValues = deliveryDbList.find(deliveryitem => {
      return deliveryitem.type === DeliveryStatuses.TO_RECEIVE;
    });
    
    if(!deliveryReceiveDataValues) {
      const message = `Não existe nenhum processo de delivery programado para envio, para o pedido ${requestId}.`
      console.log(message)
      res.status(STATUS_INVALID_REQUEST).json(message)
      res.end()

      throw new Error(message)
    }
        
    const deliveryReceiveData = deliveryReceiveDataValues.dataValues;
    const deliveryStatusFromCompany = await DeliveryCompanyLoadOrderService(deliveryReceiveData.deliveryId).catch(err => {
      console.log(err.message, err.data)
      console.log(`Entrega ${deliveryReceiveData.deliveryId}, do pedido ${requestId}.`)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()

      throw new Error(err.message)
    });
    
    if(!deliveryStatusFromCompany.name) {
      const message = `Não foi possível ler o status da entrega ${deliveryReceiveData.deliveryId}, do pedido ${requestId}.`
      console.log(message)
      res.status(STATUS_INVALID_REQUEST).json(message)
      res.end()

      throw new Error(message)
    }
    
    if(deliveryStatusFromCompany.name != "active" && 
      deliveryStatusFromCompany.name != "delayed"
    ) {
      
      await DeliveryCompanyCanceldOrderService(deliveryReceiveData.deliveryId).catch((err) => {
        console.log(err.message, err.data)
        console.log(`Entrega ${deliveryReceiveData.deliveryId}, do pedido ${requestId}.`);
        res.status(STATUS_SERVER_ERROR).json(err.message)
        res.end()

        throw new Error(err.message)
      });
      
      const requestUpdateMapper = new RequestUpdateMapper();
      
      requestUpdateMapper.update({
        id: requestId
      }, RequestStatuses.CANCELED).catch(err => {
        console.log(err.message, err.data)
        console.log(`Entrega ${deliveryReceiveData.deliveryId}, do pedido ${requestId}.`);
        res.status(STATUS_SERVER_ERROR).json(err.message)
        res.end()

        throw new Error(err.message)
      });
      
      const emailContent = emailHelper(
        "Cancelamento de pedido", 
        userFromToken.name, 
        userFromToken.email,
        [
          "Informamos que o seguinte pedido foi cancelado com sucesso:",
          `ID do pedido: ${requestId}`,
        ]
      )
      await emailService(emailContent).catch(async  (err) => {
        console.log(err.message, err.data)
        res.status(STATUS_SERVER_ERROR).json(err.message)
        res.end()
        throw new Error(err.message)
      })
      res.status(STATUS_REQUEST_ACCEPT).send("Pedido foi cancelado, sem cobrança de taxas extras.")
      res.end()

      return;
    } else {
      const message = `É necessário pagar a taxa de cancelamento da entrega ${deliveryReceiveData.deliveryId}, do pedido ${requestId}.`
      console.log(message)
      res.status(STATUS_SEE_OTHER).json(message)
      res.end()

      throw new Error(message)
    }
  })
  
  return api;
}