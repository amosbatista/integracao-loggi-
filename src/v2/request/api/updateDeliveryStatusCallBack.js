import { Router } from 'express'

/*import RequestUpdateMapper from '../mapper/updateStatus'
import requestStatus from '../status'

import DeliveryLoadMapper from '../../delivery/db/mappers/loadByDeliveryId'
*/
import DeliveryUpdateMapper from '../../delivery/db/mappers/updateStatus'


const api = ({ config, db }) => {

    const EVENTTYPE_ORDERCHANGE = 'order_changed';
    const EVENTTYPE_DELIVERYCHANGE = 'delivery_changed';

	let api = Router();

	api.post('/', async (req, res) => {
        console.log("callback call", req.body)

        let deliveryId = "";
        let deliveryStatus = ""; 

        if(req.body?.event_type != EVENTTYPE_DELIVERYCHANGE && req.body?.event_type != EVENTTYPE_ORDERCHANGE) {
            console.log(`Status de atualização desconhecido`, req.body)
        }
        if(req.body.event_type == EVENTTYPE_DELIVERYCHANGE) {
            deliveryId = req.body.delivery.order_id;
            deliveryStatus = req.body.delivery.status;
        }
        if(req.body.event_type == EVENTTYPE_ORDERCHANGE) {
            deliveryId = req.body.order.order_id;
            deliveryStatus = req.body.order.status;
        }

        const deliveryUpdateMapper = new DeliveryUpdateMapper();

        await deliveryUpdateMapper.update(deliveryId, deliveryStatus).catch(err => {
            console.log(`Erro ao atualizar o callback de delivery para o status ${deliveryId}`, err.message);
        });

        console.log(`Delivery ${deliveryId} atualizado para status ${deliveryStatus}`);

        const STATUS_OK = 200;

        res.status(STATUS_OK).json({
            "request_status": "OK"
        })
        res.end()

        return
    
	});

	return api;
}

export default api