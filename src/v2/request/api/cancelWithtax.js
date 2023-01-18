import { Router } from 'express'

import TokenService from '../../auth/cripto/JWTTokenService';

import RequestLoadMapper from '../mapper/load';
import RequestUpdateMapper from '../mapper/updateStatus';
import RequestStatuses from '../status';

import DeliveryLoadMapper from '../../delivery/db/mappers/load';
import DeliveryStatuses from '../../delivery/db/deliveryType';
import DeliveryCompanyCanceldOrderService from '../../delivery/clickEntregas/clickEntregasCancelOrderService';
//import DeliveryCompanyLoadOrderService from '../../delivery/clickEntregas/clickEntregasLoadOrderService';
//import DeliveryCompanyCanceldOrderService from '../../delivery/clickEntregas/clickEntregasLoadOrderServiceMock';

import LoadCardMapper from '../../cardControl/mapper/load';
import PaymentHelper from '../services/PaymentHelper';

import PaymentAuthorizationService from '../payment/mapper/new';
import PaymentStatus from '../payment/paymentStatus';

import emailService from '../../email/service'
import emailHelper from '../../email/emailHelper'

export default ({ config, db }) => {

	let api = Router();

	api.post('/', async (req, res) => {
    const STATUS_UNAUTHORIZED = 401;
    const STATUS_INVALID_REQUEST = 400
    const STATUS_REQUEST_ACCEPT = 202
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
      console.log(message)
      res.status(STATUS_INVALID_REQUEST).json(message)
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

    /*const deliveryStatusFromCompany = await DeliveryCompanyLoadOrderService(deliveryReceiveData.deliveryId).catch(err => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()

      throw new Error(err.message)
    });*/
    
    if(deliveryReceiveData.deliveryStatus != "canceled") { 
      await DeliveryCompanyCanceldOrderService(deliveryReceiveData.deliveryId).catch((err) => {
        console.log(err.message, err.data)
        console.log(`Entrega ${deliveryReceiveData.deliveryId}, do pedido ${requestId}.`);
        res.status(STATUS_SERVER_ERROR).json(err.message)
        res.end()

        throw new Error(err.message)
      });
    }
    
    const requestUpdateMapper = new RequestUpdateMapper();
      
    requestUpdateMapper.update({
      id: requestId
    }, RequestStatuses.WAITING_CANCELLATION_CHECK).catch(async err => {
      console.log(err.message, err.data)
      console.log(`Entrega ${deliveryReceiveData.deliveryId}, do pedido ${requestId}.`);
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end() 
    });
        
    const emailContent = emailHelper(
      "Cancelamento do pedido.",
      userFromToken.name, 
      userFromToken.email,
      [
        `O seu pedido foi cancelado. O valor do cancelamento foi retido, e será devolvido caso a transportadora não cobre este valor.`,
        `ID do pedido: ${requestId}`,
      ]
    )
    await emailService(emailContent).catch((err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()

      throw new Error(err.message)
    });
    
    
    
    res.status(STATUS_REQUEST_ACCEPT).send("Pedido foi cancelado, mediante cobrança de taxas extras.")
    res.end()
    
  })
  
  return api;
}

