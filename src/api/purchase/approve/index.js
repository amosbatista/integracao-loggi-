import { Router } from 'express'
import authService from '../../login/service'

import cieloCancelation from './services/cieloCancelation'
import cieloTransaction from './services/cieloTransaction'
import loggiApproved from './services/loggiApproved'
import loggiCancelation from './services/loggiCancelation'
import email from './services/email'
import Log from './services/log'

export default ({ config, db }) => {
	let api = Router();

	// perhaps expose some API metadata at the root
	api.post('/', (req, res) => {
    const STATUS_UNAUTHORIZED = 401
    const STATUS_SERVER_ERROR = 500

    authService().then( (authData) => {
      cieloTransaction(req.body.paymentData)

      .then((creditCardReturnData)=>{
        console.log(creditCardReturnData)
        loggiApproved(req.body.deliveryData, authData.toString())

        .then((loggiData) => {

          const log = new Log()
          
          log.save({
            clientName: req.body.servicesData.clientName,
            address: req.body.addressData.streetName,
            number:  req.body.addressData.streetNumber,
            neighborhood: req.body.addressData.neighborhood,
            addressComplement: req.body.addressData.addressComplement,
            postalCode: req.body.addressData.postalCode,
            totalPurchase: req.body.paymentData.totalAmount,
            creditCard: {
              numberFromAPI: creditCardReturnData.Payment.CreditCard.CardNumber,
              brand: creditCardReturnData.Payment.CreditCard.Brand,
              holder: creditCardReturnData.Payment.CreditCard.Holder,
              proofOfSale: creditCardReturnData.Payment.ProofOfSale,
              tid: creditCardReturnData.Payment.Tid,
              authorizationCode: creditCardReturnData.Payment.AuthorizationCode,
              paymentId: creditCardReturnData.Payment.PaymentId,
              linksData: creditCardReturnData.Payment.Links
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
              res.status(STATUS_SERVER_ERROR).send(err.message)
              res.end()
            })

            .catch( (err) => {
              console.log(err.message, err.data)
              res.status(STATUS_SERVER_ERROR).send(err.message)
              res.end()
            })

          })
        })

        .catch((err) => {
          console.log(err.message, err.data)
          cieloCancelation(creditCardReturnData.Payment.PaymentId, req.body.paymentData.totalAmount)

          .then(() => {
            res.status(STATUS_SERVER_ERROR).send(err.message)
            res.end()
          })

          .catch( (err) => {
            console.log(err.message, err.data)
            res.status(STATUS_SERVER_ERROR).send(err.message)
            res.end()
          })

        })

      })

      .catch((err)=>{
        console.log(err.message, err.data)
        res.status(STATUS_SERVER_ERROR).send(err.message)
        res.end()
      })
      
    })

    .catch( (err) => {
      console.log('Unauthorized atempt to conclude order', err)
      res.status(STATUS_UNAUTHORIZED).send(err.message)
      res.end()
    })

	});

	return api;
}
