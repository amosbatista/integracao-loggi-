import { Router } from 'express'

import TokenService from '../../auth/cripto/JWTTokenService';

import RequestLoadMapper from '../mapper/load';
import RequestUpdateMapper from '../mapper/updateStatus';
import RequestStatuses from '../status';

import LoadPaymentMapper from '../payment/mapper/loadAuthorizedPaymentFromCancelledDelivery'

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
    
    if(req.body.mustConfirmCancellationPayment == undefined) {
      const message = 'Deve ser informada a decisão de cobrar a taxa de cancelamento ou não.'
      console.log(message)
      res.status(STATUS_INVALID_REQUEST).json(message)
      res.end()

      throw new Error(message)
    }
    const mustConfirmCancellationPayment = req.body.mustConfirmCancellationPayment;

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
    
    if(requestData.status != RequestStatuses.WAITING_CANCELLATION_CHECK) {
      const message = 'Só é permitido confirmar cancelamentos em pedidos já cancelados.'
      console.log(message)
      res.status(STATUS_INVALID_REQUEST).json(message)
      res.end()

      throw new Error(message)
    }    
    
    const loadPaymentMapper = new LoadPaymentMapper();
    const paymentData = await loadPaymentMapper.load(requestId).catch( err => {
      res.status(STATUS_SERVER_ERROR).json(err)
      res.end()
      throw new Error(err)
    });    
    

    if(mustConfirmCancellationPayment) {
      const paymentHelper = new PaymentHelper();

      await paymentHelper.Capture(paymentData.paymentId).catch((err)=>{
        res.status(STATUS_SERVER_ERROR).json(err)
        res.end()
        throw new Error(err)
      });


      const paymentAuthorizationService = new PaymentAuthorizationService();
    
      await paymentAuthorizationService.save(requestId, RequestStatuses.CANCELED, {
        cardHash: paymentData.cardHash,
        authorizationCode: paymentData.authorizationCode,
        paymentId: paymentData.paymentId,
        transactionStatus: paymentData.transactionStatus,
        returnCode: paymentData.returnCode,
        returnMessage: paymentData.returnMessage,
        status: PaymentStatus.AUTHORIZED,
      }).catch ( async (approvationError) => {
        console.log('Erro ao aprovar compra na base de dados.', approvationError)

        await paymentHelper.Cancel(paymentData.paymentId);
        res.status(STATUS_SERVER_ERROR).json(approvationError.message)
        res.end() 
      })

      const requestUpdateMapper = new RequestUpdateMapper();
      
      requestUpdateMapper.update({
        id: requestId
      }, RequestStatuses.CANCELED).catch(async err => {
        console.log(err.message, err.data)
        res.status(STATUS_SERVER_ERROR).json(err.message)
        res.end() 
      });

      const emailContent = emailHelper(
        "Confirmação de pagamento de cancelamento.",
        userFromToken.name, 
        userFromToken.email,
        [
          `O pagamento do cancelamento foi confirmado.`,
          `ID do pedido: ${requestId}`,
          `Código de transação bancária: ${paymentData.paymentId}`,
        ]
      )
      await emailService(emailContent).catch((err) => {
        console.log(err.message, err.data)
        res.status(STATUS_SERVER_ERROR).json(err.message)
        res.end()
  
        throw new Error(err.message)
      });
      
      
      
      res.status(STATUS_REQUEST_ACCEPT).send("A cobrança de taxas extras foi efetivada.")
      res.end()
      
      
    }
    else {
      const paymentAuthorizationService = new PaymentAuthorizationService();
    
      await paymentAuthorizationService.save(requestId, RequestStatuses.CANCELED, {
        cardHash: paymentData.cardHash,
        authorizationCode: paymentData.authorizationCode,
        paymentId: paymentData.paymentId,
        transactionStatus: paymentData.transactionStatus,
        returnCode: paymentData.returnCode,
        returnMessage: paymentData.returnMessage,
        status: PaymentStatus.CANCELED,
      }).catch ( async (approvationError) => {
        console.log('Erro ao cancelar compra na base de dados.', approvationError)

        await paymentHelper.Cancel(paymentData.paymentId);
        res.status(STATUS_SERVER_ERROR).json(approvationError.message)
        res.end() 
      })

      const requestUpdateMapper = new RequestUpdateMapper();
      
      requestUpdateMapper.update({
        id: requestId
      }, RequestStatuses.CANCELED).catch(async err => {
        console.log(err.message, err.data)
        res.status(STATUS_SERVER_ERROR).json(err.message)
        res.end() 
      });

      const emailContent = emailHelper(
        "Devolução de pagamento de cancelamento.",
        userFromToken.name, 
        userFromToken.email,
        [
          `O pagamento do cancelamento foi devolvido.`,
          `Como não houve cobrança da parte da entregadora, a cobrança da taxa de cancelamento foi cancelada.`,
          `ID do pedido: ${requestId}`,
        ]
      )
      await emailService(emailContent).catch((err) => {
        console.log(err.message, err.data)
        res.status(STATUS_SERVER_ERROR).json(err.message)
        res.end()
  
        throw new Error(err.message)
      });
      
      res.status(STATUS_REQUEST_ACCEPT).send("Pedido foi cancelado, e a cobrança de taxas extras foi cancelada.")
      res.end()
    }

  })

  return api;
}

