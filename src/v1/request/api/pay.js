import { Router } from 'express'
import RequestLoadMapper from '../mapper/load'
import transactionService from '../../bankTransaction/cieloTransactionService'
//import transactionService from '../../bankTransactionMock/cieloTransactionService'
import cancelTransactionService from '../../bankTransaction/cieloCancelationService'
import OrderLoadMapper from '../order/mapper/load'
import emailService from '../../email/service'
import RequestStatusUpdateMapper from '../mapper/updateStatus'
import RequestLogMapper from '../log/mapper'
import requestStatus from '../status'
import OrderProcessedMarkerMapper from '../order/mapper/markAsOrdered'
import emailHelper from '../../email/emailHelper'
import PaymentAuthorizationService from '../payment/mapper/new';
import paymentStatus from '../../request/payment/paymentStatus';
import transactionCaptureService from '../../bankTransaction/cieloCaptureService';
//import transactionCaptureService from '../../bankTransactionMock/cieloCaptureService';
import timeService from '../../time/workTimeService'

const api = ({ config, db }) => {

	let api = Router();

	api.post('/', (req, res) => {

		/*const checkCurrentTime = timeService.isWorkTime();
		
    if(!checkCurrentTime){
      
			errorDealer({
				message: 'Horário fora do expediente',
				data: timeService.currentTime(),
			}, res, STATUS_UNAUTHORIZED)
			
			res.end()
			
			return
    }*/
		
		const validateBodyErrors = validateBody(req.body)
		
		if(validateBodyErrors){
			errorDealer({
				message: validateBodyErrors,
				data: null
			}, res, STATUS_INVALID_REQUEST)

      return
		}

		const requestLoadMapper = new RequestLoadMapper()

		requestLoadMapper.load(request.requestId).then( (request) => {

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
					"cardNumber": request.paymentData.cardNumber,
					"nameFromCard": request.paymentData.nameFromCard,
					"validate": request.paymentData.validate, 
					"cvv": request.paymentData.cvv,
					"brand": request.paymentData.brand
				}

				transactionService(paymentData).then( (transactionReturnedData) => {
					console.log("transactionReturnedData", transactionReturnedData)
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
					

					  // Solicitação para o cartório
						const emailContentForNotary = emailHelper(
							"Pagamento de pedido -  Solicitação pedido", 
							'20º Cartório', 
							[
								'izabelfranco@20cartorio.com.br', 
								'paulorezende@20cartorio.com.br', 
								'contato.mkt@20cartorio.com.br',
								'amos.silva@gmail.com'
							],
							[
								"Um cliente pagou um serviço e deseja a sua devolução:",
								`ID do pedido: ${request.id}`,
								`Nome: ${request.clientName} `,
								`Email: ${  request.clientEmail}`,
								`Endereço de entrega: ${request.completeAddress} - ${request.addressComplement}`,
								`Valor pago: ${request.totalPurchase}`,
								`Código de transação bancária: ${transactionReturnedData.Payment.PaymentId}`,
							]
						)
						const emailToNotaryPromise =  emailService(emailContentForNotary)

					const emailContent = emailHelper(
						"Pagamento de pedido",
						request.clientName,
						request.clientEmail,
						[
							"O horário de funcionamento do atendimento Delivery é de segunda a sexta-feira das 09:00 às 16:00 (exceto feriados). Pedidos realizados após às 16:00, serão realizados no dia seguinte a partir das 09:00.",
							"",
							`O pagamento do pedido foi realizado com sucesso!`,
							`ID do pedido: ${request.id}`,
							`Valor pago: ${request.totalPurchase}`,
							`Código de transação bancária: ${transactionReturnedData.Payment.PaymentId}`,
							`Aguarde um pouco para o cartório receber o pagamento e enviar o pedido.`
						]
					)
					const emailPromise = emailService(emailContent)
					
					const requestStatusUpdateMapper = new RequestStatusUpdateMapper()
					const requestStatusUpdatePromise = requestStatusUpdateMapper.update(request, requestStatus.WAITING_DELIVERY_RETURN_ORDER)

					const requestLogMapper = new RequestLogMapper()
					const requestLogPromise = requestLogMapper.save(request, requestStatus.WAITING_DELIVERY_RETURN_ORDER)

					const orderProcessedMarkerMapper = new OrderProcessedMarkerMapper()
					const orderProcessedMarkerPromise = orderProcessedMarkerMapper.save(order)

					const transactionCapturePromise = transactionCaptureService(transactionReturnedData.Payment.PaymentId)
					


					Promise.all([
						emailToNotaryPromise,
						emailPromise,
						requestStatusUpdatePromise,
						requestLogPromise,
						orderProcessedMarkerPromise,
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

						res.status(STATUS_REQUEST_ACCEPT).send({
							transactionId: transactionReturnedData.Payment.PaymentId
						})
						res.end()

						return
					}).catch( (err) => {
						cancelTransactionService(transactionReturnedData.Payment.PaymentId)
						cancelPayment(transactionReturnedData, paymentAuthorizationService, request.id, paymentStatus.CANCELED)
						errorDealer(err, res)
					})
				}).catch( (err) => {

					errorDealer(err, res)
				})
			}).catch((err) => {
				errorDealer(err, res)
			})
		}).catch((err) => {errorDealer(err, res)} )
	});

	return api;
}

const STATUS_INVALID_REQUEST = 400
const STATUS_UNAUTHORIZED = 401
const STATUS_REQUEST_ACCEPT = 202
const STATUS_SERVER_ERROR = 500

const validateBody = (body) => {
	if (!body.requestId){
		return "Id do pedido está vazio"
	}
	if(!body.paymentData) {
		return "Requisição veio sem informações de compra"
	}
	return null
}


const errorDealer = (err, res, status=STATUS_SERVER_ERROR) => {
  console.log("Error at pay", err)
  res.status(status).send(err)
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


