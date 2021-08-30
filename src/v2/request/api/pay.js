import { Router } from 'express'
import RequestLoadMapper from '../mapper/load'
import transactionService from '../../bankTransaction/cieloTransactionService'
import cancelTransactionService from '../../bankTransaction/cieloCancelationService'
import OrderLoadMapper from '../order/mapper/load'
import deliveryReturnService from '../../delivery/clickEntregas/clickEntregasCreateReturnOrderService'
import emailService from '../../email/service'
import RequestStatusUpdateMapper from '../mapper/updateStatus'
import RequestLogMapper from '../log/mapper'
import requestStatus from '../status'
import OrderProcessedMarkerMapper from '../order/mapper/markAsOrdered'
import emailHelper from '../../email/emailHelper'
import deliveryCancellationService from '../../delivery/clickEntregas/clickEntregasCancelOrderService'
import DeliveryMapper from '../../delivery/db/mappers/save'
import DeliveryType from '../../delivery/db/deliveryType'
import deliveryType from '../../delivery/db/deliveryType';
import PaymentAuthorizationService from '../payment/mapper/new';
import paymentStatus from '../../request/payment/paymentStatus';
import transactionCaptureService from '../../bankTransaction/cieloCaptureService';
import timeService from '../../time/workTimeService'

const api = ({ config, db }) => {

	let api = Router();

	api.post('/', (req, res) => {
		const STATUS_INVALID_REQUEST = 400
		const STATUS_REQUEST_ACCEPT = 202
		const STATUS_SERVER_ERROR = 500

		const checkCurrentTime = timeService.isWorkTime();
		
    if(!checkCurrentTime.isOnWorkTime){
      
			errorDealer({
				message: 'Horário fora do expediente',
				data: checkCurrentTime.currentTime,
			}, res, STATUS_SERVER_ERROR)
			
			res.end()
			
			return
    }
		
		const validateBodyErrors = validateBody(req.body)
		
		if(validateBodyErrors){
			errorDealer({
				message: validateBodyErrors,
				data: null
			}, res, STATUS_INVALID_REQUEST)

      return
		}

		const requestLoadMapper = new RequestLoadMapper()

		requestLoadMapper.load(req.body.requestId).then( (request) => {

			const orderLoadMapper = new OrderLoadMapper()
			orderLoadMapper.load(request.id).then( (order) => {

				if (!order) {
					errorDealer({
						message: "Pagamento não existe",
						data: null
					}, res, STATUS_INVALID_REQUEST)
		
					return
				}

				if(order.isOrderComplete) {
					errorDealer({
						message: "Pagamento já foi realizado",
						data: null
					}, res, STATUS_INVALID_REQUEST)
		
					return
				}

				const paymentAuthorizationService = new PaymentAuthorizationService();

				const paymentData = {
					"totalAmount": request.totalPurchase,
					"deliveryTax": request.deliveryTax,
					"cardNumber": req.body.paymentData.cardNumber,
					"nameFromCard": req.body.paymentData.nameFromCard,
					"validate": req.body.paymentData.validate, 
					"cvv": req.body.paymentData.cvv,
					"brand": req.body.paymentData.brand
				}

				transactionService(paymentData).then( (transactionReturnedData) => {

					paymentAuthorizationService.save(request.id, {
						cardNumber: transactionReturnedData.Payment.CreditCard.CardNumber,
						cardHolder: transactionReturnedData.Payment.CreditCard.Holder,
						authorizationCode: transactionReturnedData.Payment.AuthorizationCode,
						paymentId: transactionReturnedData.Payment.PaymentId,
						transactionStatus: transactionReturnedData.Payment.Status,
						returnCode: transactionReturnedData.Payment.ReturnCode,
						returnMessage: transactionReturnedData.Payment.ReturnMessage,
						status: paymentStatus.AUTHORIZED,
					}).catch ( (approvationError) => {
						console.log('Erro ao aprovar compra na base de dados.', approvationError)
					})

					const addressData = {
						coordinates: {
							lat: request.addressLat,
							lng: request.addressLng
						},
						completeAddress: request.completeAddress,
						addressComplement: request.addressComplement
					}
					const servicesData = {
						clientName: request.clientName,
						clientPhone: request.clientPhone
					}
					
					deliveryReturnService(addressData, servicesData, request.id).then( (deliveryData) => {

						const emailContent = emailHelper(
							"Pagamento de pedido",
							request.clientName,
							request.clientEmail,
							[
								`O pagamento do pedido foi realizado com sucesso!`,
								`ID do pedido: ${deliveryData.loggiOrderId}`,
								`ID do sistema delivery: ${request.id}`,
								`Valor pago: ${request.totalPurchase}`,
								`Código de transação bancária: ${transactionReturnedData.Payment.PaymentId}`,
								`Aguarde um pouco para o cartório receber o pagamento e enviar o pedido.`
							]
						)
						const emailPromise = emailService(emailContent)
						
						const requestStatusUpdateMapper = new RequestStatusUpdateMapper()
						const requestStatusUpdatePromise = requestStatusUpdateMapper.update(request, requestStatus.READY_TO_RETURN)

						const requestLogMapper = new RequestLogMapper()
						const requestLogPromise = requestLogMapper.save(request, requestStatus.READY_TO_RETURN)

						const orderProcessedMarkerMapper = new OrderProcessedMarkerMapper()
						const orderProcessedMarkerPromise = orderProcessedMarkerMapper.save(order)

						const transactionCapturePromise = transactionCaptureService(transactionReturnedData.Payment.PaymentId)
						
						
						console.log({
							requestId: request.id,
							deliveryId: deliveryData.loggiOrderId,
							packageId: deliveryData.packageId,
							type: DeliveryType.TO_RETURN
						})
						const deliveryMapper = new DeliveryMapper()
						const deliveryPromise = deliveryMapper.save({
							requestId: request.id,
							deliveryId: deliveryData.loggiOrderId,
							packageId: deliveryData.packageId,
							type: deliveryType.TO_RETURN
						})

						Promise.all([
							emailPromise,
							requestStatusUpdatePromise,
							requestLogPromise,
							orderProcessedMarkerPromise,
							deliveryPromise,
							transactionCapturePromise,
						]).then( () => {

							paymentAuthorizationService.save(request.id, {
								cardNumber: transactionReturnedData.Payment.CreditCard.CardNumber,
								cardHolder: transactionReturnedData.Payment.CreditCard.Holder,
								authorizationCode: transactionReturnedData.Payment.AuthorizationCode,
								paymentId: transactionReturnedData.Payment.PaymentId,
								transactionStatus: transactionReturnedData.Payment.Status,
								returnCode: transactionReturnedData.Payment.ReturnCode,
								returnMessage: transactionReturnedData.Payment.ReturnMessage,
								status: paymentStatus.CONFIRMED,
							})

							res.status(STATUS_REQUEST_ACCEPT).json({
								transactionId: transactionReturnedData.Payment.PaymentId
							})
							res.end()

							return
						}).catch( (err) => {
							deliveryCancellationService(deliveryData.loggiOrderId)
							cancelTransactionService(transactionReturnedData.Payment.PaymentId)
							cancelPayment(transactionReturnedData, paymentAuthorizationService, request.id, paymentStatus.CANCELED)
							errorDealer(err, res)
						})
					}).catch( (err) => {
						cancelTransactionService(transactionReturnedData.Payment.PaymentId)
						cancelPayment(transactionReturnedData, paymentAuthorizationService, request.id, paymentStatus.CANCELED)
						errorDealer(err, res)
					})
				}).catch((err) => {
					errorDealer(err, res)
				})
			}).catch((err) => {errorDealer(err, res)} )
		}).catch((err) => {errorDealer(err, res)} )
	});

	return api;
}

const validateBody = (body) => {
	if (!body.requestId){
		return "Id do pedido está vazio"
	}
	if(!body.paymentData) {
		return "Requisição veio sem informações de compra"
	}
	return null
}


const errorDealer = (err, res, status) => {
  console.log(err.message, err.data)
  res.status(status || 500).json(err.message)
  res.end()
}

const cancelPayment = (err, paymentAuthorizationService, requestId, status) => {

	paymentAuthorizationService.save(requestId, {
		cardNumber: err.Payment.CreditCard.CardNumber || "",
		cardHolder: err.Payment.CreditCard.Holder || "",
		authorizationCode: err.Payment.AuthorizationCode || "",
		paymentId: err.Payment.PaymentId || "",
		transactionStatus: err.Payment.Status,
		returnCode: err.Payment.ReturnCode,
		returnMessage: err.Payment.ReturnMessage,
		status: status
	})

};

export default api 


