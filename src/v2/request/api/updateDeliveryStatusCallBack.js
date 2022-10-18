import { Router } from 'express'

/*import RequestUpdateMapper from '../mapper/updateStatus'
import requestStatus from '../status'

import DeliveryLoadMapper from '../../delivery/db/mappers/loadByDeliveryId'
*/
import DeliveryUpdateMapper from '../../delivery/db/mappers/updateStatus'


const api = ({ config, db }) => {

	let api = Router();

	api.post('/', async (req, res) => {
    
        const deliveryId = req.body.delivery.delivery_id;
        const deliveryStatus = req.body.delivery.status;

        const deliveryUpdateMapper = new DeliveryUpdateMapper();

        await deliveryUpdateMapper.update(deliveryId, deliveryStatus).catch(err => {
            console.log(`Erro ao atualizar o callback de delivery para o status ${deliveryId}`, err.message);
        });

        res.json({
            "request_status": "OK"
        })
        res.end()

        return
    
	});

	return api;
}

export default api