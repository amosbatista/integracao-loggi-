import { Router } from 'express'
import deliveryAuthService from '../../delivery/loggiLogin/service'

import loggiApproved from '../../delivery/loggiApproveDeliveryService'
import loggiCancelation from '../../delivery/loggiCancelDelivery'
import NewRequestMapper from '../mapper/new'
import RequestLog from '../log/mapper'
import RequestStatus from '../status'
import emailService from '../../email/service'

export default ({ config, db }) => {

	let api = Router();

	/**
   * Autenticação
   *    Aprovação Loggi
   *        Gravar Requisição no Banco
   *          Gravar Log
   *          Enviar e-mail
   */
	api.post('/', (req, res) => {

    const STATUS_UNAUTHORIZED = 401
    const STATUS_SERVER_ERROR = 500

    deliveryAuthService().then( (authData) => {

      loggiApproved(req.body.addressData, req.body.servicesData, req.body.paymentData, authData.toString())

      .then((loggiData) => {

        const newRequestMapper = new NewRequestMapper()

        newRequestMapper.save({
          clientName: req.body.servicesData.clientName,
          clientEmail: req.body.servicesData.clientEmail,
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
        }).then( (request) => {

          const requestLog = new RequestLog()

          const requestLogPromise = requestLog.save(request, RequestStatus.AT_RECEIVE)
          const emailServicePromise = emailService(request.clientEmail, request.clientName, "O pedido foi efetuado com sucesso. O desenvolvedor deve informar os dados do pedido")

          Promise.all([
            requestLogPromise,
            emailServicePromise
          ]).then( () => {
          
            res.json({
              isProcessOk: true,
              loggiOrderId: loggiData.loggiOrderId,
              requestId: request.id
            })
            res.end()
            
          }).catch( (err) => {
            console.log(err.message, err.data)

            Promise.all([
              loggiCancelation(loggiData.loggiOrderId, authData.toString())
            ]).then(() => {
              res.status(STATUS_SERVER_ERROR).send(err.message)
              res.end()
            }).catch( (err) => {
              console.log(err.message, err.data)
              res.status(STATUS_SERVER_ERROR).send(err.message)
              res.end()
            })
          })
        })
        .catch( (err) => {
          console.log(err.message, err.data)
          res.status(STATUS_SERVER_ERROR).send(err.message)
          res.end()
        })
      })

      .catch((err)=>{
        console.log(err.message, err.data)
        res.status(STATUS_SERVER_ERROR).send(err.message)
        res.end()
      })
      
    })

    .catch( (err) => {
      console.log('Tentativa não autorizada de concluir aprovação', err)
      res.status(STATUS_UNAUTHORIZED).send(err.message)
      res.end()
    })

	});

	return api;
}
