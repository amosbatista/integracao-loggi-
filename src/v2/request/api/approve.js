import { Router } from 'express'

import deliveryApproved from '../../delivery/clickEntregas/clickEntregasCreateOrderServiceMock'
//import deliveryApproved from '../../delivery/clickEntregas/clickEntregasCreateOrderService'
import deliveryCancelation from '../../delivery/clickEntregas/clickEntregasCancelOrderServiceMock'
//import deliveryCancelation from '../../delivery/clickEntregas/clickEntregasCancelOrderService'
import NewRequestMapper from '../mapper/new'
import UpdateRequestMapper from '../mapper/updateStatus'
import RequestLog from '../log/mapper'
import RequestStatus from '../status'
import emailService from '../../email/service'
import emailHelper from '../../email/emailHelper'
import DeliveryMapper from '../../delivery/db/mappers/save'
import deliveryType from '../../delivery/db/deliveryType'
import ServiceMapper from '../../notary/services/mapper/save'
import currencyFormat from '../../helpers/formatCurrency'
import logService from '../log/logGenerator'
import TokenService from '../../auth/cripto/JWTTokenService';
import UserStatusCheckMapper from '../mapper/isUserWithTransitingRequest';
import PaymentAuthorizationService from '../payment/mapper/new';
import PaymentStatus from '../payment/paymentStatus';
import LoadCardMapper from '../../cardControl/mapper/load';

import PaymentHelper from '../services/PaymentHelper';

export default ({ config, db }) => {

	let api = Router();

	api.post('/', async (req, res) => {

    const STATUS_SERVER_ERROR = 500

    logService('Approve request', req.body)

    const token = req.header("Authorization");
    const tokenService = new TokenService();
    const STATUS_UNAUTHORIZED = 401;
    const userFromToken = await tokenService.verify(token).catch((err) => {
      const message = 'Erro de autenticação'
      console.log(message, err)
      res.status(STATUS_UNAUTHORIZED).json(err)
      res.end()

      throw new Error(message)
    });

    const userStatusCheckMapper = new UserStatusCheckMapper();
    const isUserWithTransitingRequest = await userStatusCheckMapper.check(userFromToken.id).catch( (err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    });

    if(isUserWithTransitingRequest) {
      const message = "Usuário já tem um pedido em transição. Favor aguardar a entrega ou devolução do documento."
      console.log(message)
      res.status(STATUS_SERVER_ERROR).json(message)
      res.end()
      throw new Error(message)
    }
    
    const updateStatusRequest = new UpdateRequestMapper();
    const newRequestMapper = new NewRequestMapper()
    const request = await newRequestMapper.save({
      userId: userFromToken.id,
      clientName: userFromToken.name,
      clientEmail: userFromToken.email,
      clientPhone: req.body.servicesData.clientPhone,
      completeAddress: req.body.addressData.completeAddress,
      addressComplement: req.body.addressData.addressComplement,
      addressLat: req.body.addressData.coordinates.lat,
      addressLng: req.body.addressData.coordinates.lng,
      totalPurchase: req.body.paymentData.totalAmount,
      deliveryTax: req.body.paymentData.deliveryTax,
      servicesSum: req.body.paymentData.servicesSum,
      transactionOperationTax: req.body.paymentData.transactionOperationTax,
      status: RequestStatus.AT_RECEIVE
    }).catch( async (err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    });
    
    const loadCardMapper = new LoadCardMapper();
    const cardData = await loadCardMapper.load(userFromToken.id).catch(async (err) => {
      console.log(err.message, err.data)
      await updateStatusRequest.update(request, RequestStatus.CANCELED).catch(cancelErr => {
        console.log(cancelErr.message, cancelErr.data)
      })
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()

      throw new Error(err.message)
    });
    
    
    const HALF_DELIVERY_FACTOR = 2;
    
    const paymentData = {
      "CardToken": cardData.cardHash,
      "totalAmount": request.deliveryTax / HALF_DELIVERY_FACTOR,
      "cvv": req.body.paymentData.cvv,
      "brand": cardData.cardBrand
    }
    
    const paymentHelper = new PaymentHelper();
      
    const transactionReturnedData = await paymentHelper.Pay(paymentData).catch(async (err)=>{
      await updateStatusRequest.update(request, RequestStatus.CANCELED).catch(cancelErr => {
        console.log(cancelErr.message, cancelErr.data)
      })
      res.status(STATUS_SERVER_ERROR).json(err)
      res.end()
      throw new Error(err)
    });
    
    const paymentAuthorizationService = new PaymentAuthorizationService();
    
    await paymentAuthorizationService.save(request.id, {
      cardHash: cardData.cardHash,
      authorizationCode: transactionReturnedData.Payment.AuthorizationCode,
      paymentId: transactionReturnedData.Payment.PaymentId,
      transactionStatus: transactionReturnedData.Payment.Status,
      returnCode: transactionReturnedData.Payment.ReturnCode,
      returnMessage: transactionReturnedData.Payment.ReturnMessage,
      status: PaymentStatus.AUTHORIZED,
    }).catch ( async (approvationError) => {
      console.log('Erro ao aprovar compra na base de dados.', approvationError)
      await updateStatusRequest.update(request, RequestStatus.CANCELED).catch(cancelErr => {
        console.log(cancelErr.message, cancelErr.data)
      })
      res.status(STATUS_SERVER_ERROR).json(approvationError)
      res.end()
      throw new Error(approvationError)
    })
    
    const loggiData = await deliveryApproved(
      req.body.addressData, 
      req.body.servicesData, 
    ).catch(async (err)=>{
      console.log(err.message, err.data)
      await updateStatusRequest.update(request, RequestStatus.CANCELED).catch(cancelErr => {
        console.log(cancelErr.message, cancelErr.data)
      })
      await paymentHelper.Cancel();
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    })

    const deliveryMapper = new DeliveryMapper()

    await deliveryMapper.save({
      requestId: request.id,
      deliveryId: loggiData.loggiOrderId,
      packageId: loggiData.packageId,
      type: deliveryType.TO_RECEIVE
    }).catch( async (err) => {
      await updateStatusRequest.update(request, RequestStatus.CANCELED).catch(cancelErr => {
        console.log(cancelErr.message, cancelErr.data)
      })
      await deliveryCancelation(loggiData.loggiOrderId)
      await paymentHelper.Cancel();
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    })

    const serviceMapper = new ServiceMapper()
    const requestServicesSavePromises = req.body.servicesData.services.map( async (service)=> {

      return new Promise( async (resolve, reject) => {
        await serviceMapper.save(request.id, service).catch( (err) => {
          reject(err)
        })

        resolve()
      })
    })

    await Promise.all(requestServicesSavePromises).catch(async (err) => {
      await updateStatusRequest.update(request, RequestStatus.CANCELED).catch(cancelErr => {
        console.log(cancelErr.message, cancelErr.data)
      })
      await deliveryCancelation(loggiData.loggiOrderId)
      await paymentHelper.Cancel();
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    })
    
    const paymentId = await paymentHelper.Capture().catch(async (err) => {
      await updateStatusRequest.update(request, RequestStatus.CANCELED).catch(cancelErr => {
        console.log(cancelErr.message, cancelErr.data)
      })
      await deliveryCancelation(loggiData.loggiOrderId)
      await paymentHelper.Cancel();
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    })
    

    const formatedValues = {
      deliveryTax: currencyFormat(req.body.paymentData.deliveryTax),
      servicesSum: currencyFormat(req.body.paymentData.servicesSum),
      transactionOperationTax: currencyFormat(req.body.paymentData.transactionOperationTax),
      totalAmount: currencyFormat(req.body.paymentData.totalAmount)
    }
    const emailContent = emailHelper(
      "Aprovação de pedido", 
      userFromToken.name, 
      userFromToken.email,
      [
        "Informamos que o pedido foi efetuado com sucesso. Segue os dados dele:",
        `ID do sistema delivery: ${loggiData.loggiOrderId}`,
        `ID do pedido: ${request.id}`,
        `Endereço de retirada: ${req.body.addressData.completeAddress} - ${req.body.addressData.addressComplement}`,
        `Taxa de entrega: ${formatedValues.deliveryTax}`,
        `Total dos serviços: ${formatedValues.servicesSum}`,
        `Taxa de transação bancária: ${formatedValues.transactionOperationTax}`,
        `Total geral: ${formatedValues.totalAmount}`,
        `Código do pagamento efetuado (só de ida): ${paymentId}`,
        `Cartão utilizado na compra: ${cardData.cardNumber}`,
        "Observação: Se houver qualquer diferença em relação aos serviços e à documentação enviada, o valor final será alterado."
      ]
    )
    await emailService(emailContent).catch(async  (err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    })
    
    const requestLog = new RequestLog()
    await requestLog.save(request, RequestStatus.AT_RECEIVE).catch( (err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    })
    
    res.json({
      isProcessOk: true,
      loggiOrderId: loggiData.loggiOrderId,
      requestId: request.id,
      paymentId
    })
    res.end()
  })

	return api;
}
