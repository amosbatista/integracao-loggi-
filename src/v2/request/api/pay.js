import { Router } from 'express'
import RequestLoadMapper from '../mapper/load'
import OrderLoadMapper from '../order/mapper/load'
//import deliveryReturnService from '../../delivery/clickEntregas/clickEntregasCreateReturnOrderService'
import deliveryReturnService from '../../delivery/clickEntregas/clickEntregasCreateReturnOrderServiceMock'
import emailService from '../../email/service'
import RequestStatusUpdateMapper from '../mapper/updateStatus'
import RequestLogMapper from '../log/mapper'
import requestStatus from '../status'
import OrderProcessedMarkerMapper from '../order/mapper/markAsOrdered'
import emailHelper from '../../email/emailHelper'
//import deliveryCancellationService from '../../delivery/clickEntregas/clickEntregasCancelOrderService'
import deliveryCancellationService from '../../delivery/clickEntregas/clickEntregasCancelOrderServiceMock'
import DeliveryMapper from '../../delivery/db/mappers/save'
import DeliveryType from '../../delivery/db/deliveryType'
import deliveryType from '../../delivery/db/deliveryType';
import PaymentAuthorizationService from '../payment/mapper/new';
import paymentStatus from '../../request/payment/paymentStatus';
import timeService from '../../time/workTimeService';
import PaymentHelper from '../services/PaymentHelper';
import TokenService from '../../auth/cripto/JWTTokenService';
import LoadCardMapper from '../../cardControl/mapper/load';

const processor = ({ config, db }) => {

	let api = Router();
	
	const paymentAuthorizationService = new PaymentAuthorizationService();

	api.post('/', async (req, res) => {
		const STATUS_INVALID_REQUEST = 400
		const STATUS_REQUEST_ACCEPT = 202
		const STATUS_SERVER_ERROR = 500
		const STATUS_UNAUTHORIZED = 401

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
		
		const token = req.header("Authorization");
    const tokenService = new TokenService();
    const userFromToken = await tokenService.verify(token).catch((err) => {
      const message = 'Erro de autenticação'
      console.log(message, err)
      res.status(STATUS_UNAUTHORIZED).json(err)
      res.end()

      throw new Error(message)
    });

		const requestLoadMapper = new RequestLoadMapper()

		requestLoadMapper.load(req.body.requestId).then( (request) => {

			const orderLoadMapper = new OrderLoadMapper()
			orderLoadMapper.load(request.id).then( async (order) => {

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
				
				const loadCardMapper = new LoadCardMapper();
				const cardData = await loadCardMapper.load(userFromToken.id).catch((err) => {
					console.log(err.message, err.data)
					res.status(STATUS_SERVER_ERROR).json(err.message)
					res.end()

					throw new Error(err.message)
				});
				
				const HALF_DELIVERY_FACTOR = 2;
    
				const paymentData = {
					"CardToken": cardData.cardHash,
					"totalAmount": request.totalPurchase - (request.deliveryTax / HALF_DELIVERY_FACTOR),
					"cvv": req.body.paymentData.cvv,
					"brand": cardData.cardBrand
				}
				
				const paymentHelper = new PaymentHelper();
				
				const transactionReturnedData = await paymentHelper.Pay(paymentData).catch((err)=>{
					res.status(STATUS_SERVER_ERROR).json(err)
					res.end()
					throw new Error(err)
				});
				


				paymentAuthorizationService.save(request.id, {
					cardHash: cardData.cardHash,
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
							`ID do sistema delivery: ${deliveryData.loggiOrderId}`,
							`ID do pedido: ${request.id}`,
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

					const transactionCapturePromise = paymentHelper.Capture()
					
					
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
							cardHash: cardData.cardHash,
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
						paymentHelper.Cancel()
						cancelPayment(transactionReturnedData, paymentAuthorizationService, request.id, paymentStatus.CANCELED, cardData.cardHash)
						errorDealer(err, res)
					})
				}).catch( (err) => {
					paymentHelper.Cancel()
					cancelPayment(transactionReturnedData, paymentAuthorizationService, request.id, paymentStatus.CANCELED, cardData.cardHash)
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
  console.log("Error at pay", err)
  res.status(status || 500).json(err.message)
  res.end()
}

const cancelPayment = (err, paymentAuthorizationService, requestId, status, cardHash) => {

	paymentAuthorizationService.save(requestId, {
		ccardHash: cardHash,
		authorizationCode: err.Payment.AuthorizationCode || "",
		paymentId: err.Payment.PaymentId || "",
		transactionStatus: err.Payment.Status,
		returnCode: err.Payment.ReturnCode,
		returnMessage: err.Payment.ReturnMessage,
		status: status
	})

};

export default processor 


