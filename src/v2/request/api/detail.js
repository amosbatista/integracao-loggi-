import { Router } from 'express'
import RequestMapper from '../mapper/load'
import DeliveryLoadMapper from '../../delivery/db/mappers/load'
import deliveryTypes from '../../delivery/db/deliveryType'
import ServicesMapper from '../../notary/services/mapper/loadAll'

const api = ({ config, db }) => {

	let api = Router(); 

	api.post('/', async (req, res) => {

    const requestListMapper = new RequestMapper()

    var request = await requestListMapper.load(req.body.requestId).catch((err) => {errorDealer(err, res)} );

    const deliveryLoadMapper = new DeliveryLoadMapper()
    const servicesMapper = new ServicesMapper()

    const deliveryData = await deliveryLoadMapper.load(request.id).catch((err)=>{
      errorDealer(err, res)
    })

    request.dataValues.delivery = {
      toReceive: deliveryData.find((delivery)=> {
        return delivery.type == deliveryTypes.TO_RECEIVE
      }) || {
        requestId: null,
        deliveryId: null,
        type: null
      },
      toReturn: deliveryData.find((delivery)=> {
        return delivery.type == deliveryTypes.TO_RETURN
      }) || {
        requestId: null,
        deliveryId: null,
        type: null
      }
    }

    request.dataValues.serviceData = await servicesMapper.loadAll(request.id) || []

    res.json(request)
    res.end()

    return
    
	});

	return api;
}

const STATUS_SERVER_ERROR = 500

const errorDealer = (err, res) => {
  console.log(err.message, err.data)
  res.status(STATUS_SERVER_ERROR).json(err.message)
  res.end()
}


export default api