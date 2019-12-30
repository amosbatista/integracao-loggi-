import service from '../../geolocalization/googleSearchAddressService'
import { Router } from 'express'

const api = () => {

	let api = Router(); 

	api.post('/', async (req, res) => {

    const geolocalization = await service(req.completeAddress)
      .catch(errorDealer)

    res.json(geolocalization)
    res.end()

    return
    
	});

	return api;
}

const STATUS_SERVER_ERROR = 500

const errorDealer = (err, res) => {
  console.log(err.message, err.data)
  res.status(STATUS_SERVER_ERROR).send(err.message)
  res.end()
}


export default api