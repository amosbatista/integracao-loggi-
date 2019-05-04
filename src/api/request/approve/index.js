import { Router } from 'express'
import authService from '../../login/service'

import loggiApproved from './services/loggiApproved'
import loggiCancelation from './services/loggiCancelation'
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
        loggiApproved(req.body.addressData, req.body.servicesData, req.body.paymentData, authData.toString())

        .then((loggiData) => {

          console.log("After transaction finish, on log process")
          const log = new Log()
          
          log.save({
            clientName: req.body.servicesData.clientName,
            clientEmail: req.body.servicesData.clientEmail,
            clientPhone: req.body.servicesData.clientPhone,
            completeAddress: req.body.addressData.completeAddress,
            addressComplement: req.body.addressData.addressComplement,
            totalPurchase: req.body.paymentData.totalAmount,
            deliveryTax: req.body.paymentData.deliveryTax,
            servicesSum: req.body.paymentData.servicesSum,
            transactionOperationTax: req.body.paymentData.transactionOperationTax.calculedValue,
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
            
            res.json({
              isProcessOk: true,
              loggiOrderId: loggiData.loggiOrderId,
              paymentId: creditCardReturnData.Payment.PaymentId
            })
            res.end()
           
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
