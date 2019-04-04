import { Router } from 'express'
import authService from '../../login/service'

import cieloCancelation from './services/cieloCancelation'
import cieloTransaction from './services/cieloTransaction'
import loggiApproved from './services/loggiApproved'
import loggiCancelation from './services/loggiCancelation'
import email from './services/email'
import Log from './services/log'

const log = new Log()

export default ({ config, db }) => {
	let api = Router();

	// perhaps expose some API metadata at the root
	api.post('/', (req, res) => {
    const STATUS_UNAUTHORIZED = 401
    const STATUS_SERVER_ERROR = 500

    authService().then( (authData) => {
      cieloTransaction(req.body.paymentData)

      .then((creditCardReturnData)=>{
        loggiApproved(req.body.deliveryData, authData.toString())

        .then((loggiData) => {

          log.save({
            clientName: req.body.servicesData.clientName,
            address: req.body.addressData.address,
            number:  req.body.addressData.number,
            neighborhood: req.body.addressData.neighborhood,
            totalPurchase: req.body.paymentData.totalAmount,
            creditCard: {
              numberFromAPI: creditCardReturnData.Payment.CreditCard.CardNumber,
              brand: creditCardReturnData.Payment.CreditCard.Brand,
              creditCardHolder: creditCardReturnData.Payment.CreditCard.Holder,
              creditCardProofOfSale: creditCardReturnData.Payment.ProofOfSale,
              creditCardTid: creditCardReturnData.Payment.Tid,
              creditCardAuthorizationCode: creditCardReturnData.Payment.AuthorizationCode,
              creditCardPaymentId: creditCardReturnData.Payment.PaymentId,
              creditCardLinksData: creditCardReturnData.Payment.Links
            }
          })
          
          .then( () => {
            email(req.body.servicesData.clientName, req.body.servicesData.clientEmail, "Entrega aprovada com sucesso.")

            .then( () => {
              res.json({
                isProcessOk: true,
              })
              res.end()
            })

            .catch( (err) => {
              console.log(err.message, err.data)
              res.json({
                isProcessOk: false,
                message: err.message
              })
              res.end()
            })
          })

          .catch( (err) => {
            console.log(err.message, err.data)

            Promise.all([
              cieloCancelation(creditCardReturnData.Payment.PaymentId, req.body.paymentData.totalAmount),
              loggiCancelation(loggiData.loggiOrderId, authData.toString())
            ])

            .then(() => {
              res.status(STATUS_SERVER_ERROR).send(error.message)
              res.end()
            })

            .catch( (err) => {
              console.log(err.message, err.data)
              res.status(STATUS_SERVER_ERROR).send(error.message)
              res.end()
            })

          })
        })

        .catch((err) => {
          console.log(err.message, err.data)
          cieloCancelation(creditCardReturnData.Payment.PaymentId, req.body.paymentData.totalAmount)

          .then(() => {
            res.status(STATUS_SERVER_ERROR).send(error.message)
            res.end()
          })

          .catch( (err) => {
            console.log(err.message, err.data)
            res.status(STATUS_SERVER_ERROR).send(error.message)
            res.end()
          })

        })

      })

      .catch((err)=>{
        console.log(err.message, err.data)
        res.status(STATUS_SERVER_ERROR).send(error.message)
        res.end()
      })
      
    })

    .catch( (err) => {
      console.log('Unauthorized atempt to conclude order')
      res.status(STATUS_UNAUTHORIZED).send(error.message)
      res.end()
    })

	});

	return api;
}
