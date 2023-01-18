import { Router } from 'express'

import UpdateStatusMappper from '../mapper/updateStatus'
import LoadMappper from '../mapper/load'
import email from '../../email/service'
import requestStatus from '../status'
import LogMapper from '../log/mapper'
import emailHelper from '../../email/emailHelper'

import NewPaymentModel from '../payment/mapper/new';
import LoadAprovedPaymentModel from '../payment/mapper/loadAuthorizedPaymentFromAtReceiveDelivery';
import PaymentStatus from '../payment/paymentStatus';
import PaymentHelper from '../services/PaymentHelper';

export default ({ config, db }) => {
	let api = Router();

	api.post('/', (req, res) => {
    
    const STATUS_SERVER_ERROR = 500
    const STATUS_INVALID_REQUEST = 400
    const STATUS_REQUEST_ACCEPT = 202

    if(!req.body.requestId) {
      res.status(STATUS_INVALID_REQUEST).json("ID do pedido está vazio")
      res.end()

      return
    }

    const loadMapper = new LoadMappper()

    loadMapper.load(req.body.requestId).then( async (request) => {

      if(!request){
        res.status(STATUS_INVALID_REQUEST).json("Pedido não foi localizado na base de dados")
        res.end()

        return
      }
      const requestId = req.body.requestId;

      const loadAprovedPaymentModel = new LoadAprovedPaymentModel();
      const aprovedPayment = await loadAprovedPaymentModel.load(requestId).catch(err => {
        console.log(err.message, err.data)
        res.status(STATUS_SERVER_ERROR).json(err.message)
        res.end()

        throw new Error(err)
      })

      const paymentHelper = new PaymentHelper();
      await paymentHelper.Cancel(aprovedPayment.paymentId).catch(err => {
        console.log(err)
        res.status(STATUS_SERVER_ERROR).json(err)
        res.end()

        throw new Error(err)
      })

      const newPaymentModel = new NewPaymentModel();
      const newPaymentPromise = newPaymentModel.save(request.id, requestStatus.AT_FINISH,  {
        cardNumber: aprovedPayment.CardNumber,
        cardHolder: aprovedPayment.Holder,
        authorizationCode: aprovedPayment.AuthorizationCode,
        paymentId: aprovedPayment.PaymentId,
        transactionStatus: aprovedPayment.Status,
        returnCode: aprovedPayment.ReturnCode,
        returnMessage: aprovedPayment.ReturnMessage,
        status: PaymentStatus.CONFIRMED,
      })

      const updateStatusMapper = new UpdateStatusMappper()
      const updateStatusPromise = updateStatusMapper.update(request, requestStatus.AT_FINISH)

      const emailContent = emailHelper(
        "Recebimento de pedido",
        request.clientName,
        request.clientEmail,
        [
          "Seu pedido foi recebido e está em processamento.",
          `ID do pedido: ${request.id}`,
          "Após a finalização do serviço, enviaremos um novo e-mail, informando a forma de pagamento."
        ]
      )
      const emailSendPromise = email(emailContent)

      const logMapper = new LogMapper()
      const logPromise = logMapper.save(request, requestStatus.AT_FINISH)
      
      Promise.all([
        updateStatusPromise,
        emailSendPromise,
        logPromise,
        newPaymentPromise
      ])
      .then( () => {
        res.status(STATUS_REQUEST_ACCEPT)
        res.end()
      })
      .catch( (err) => {
        console.log(err.message, err.data)
        res.status(STATUS_SERVER_ERROR).json(err.message)
        res.end()
      })

    }).catch( (err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
    })
  })

	return api;
}
