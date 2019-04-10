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

    console.log('Start of transaction process')
    console.log("On Loggi's auth")

    authService().then( (authData) => {

      console.log("On Credit Card operator process")
      cieloTransaction(req.body.paymentData)

      .then((creditCardReturnData)=>{

        console.log("On Loggi's order approvation")
        loggiApproved(req.body.deliveryData, authData.toString())

        .then((loggiData) => {

          console.log("After transaction finish, on log process")
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

            console.log("On email process", req.body.servicesData)
            email(req.body.servicesData.clientName, req.body.servicesData.clientEmail, "Entrega aprovada com sucesso.")

            .then( () => {

              console.log("Everthing is done. Returning data to response")
              res.json({
                isProcessOk: true,
                loggiOrderId: loggiData.loggiOrderId,
                paymentId: creditCardReturnData.Payment.PaymentId
              })
              res.end()
            })

            .catch( (err) => {
              console.log(err.message, err.data)
              console.log("There's some error im email process. Even that, returning data to response")
              res.json({
                isProcessOk: false,
                message: err.message,
                loggiOrderId: loggiData.loggiOrderId,
                paymentId: creditCardReturnData.Payment.PaymentId
              })
              res.end()
            })
          })

          .catch( (err) => {
            console.log(err.message, err.data)

            console.log("Trying to rollback transactions, after database failure.")
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
