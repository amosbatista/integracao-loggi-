import { Router } from 'express'
import RequestListMapper from '../mapper/loadAll'

const api = ({ config, db }) => {

	let api = Router();

	api.post('/', (req, res) => {

    const STATUS_INVALID_REQUEST = 400

    const requestListMapper = new RequestListMapper()
    requestListMapper.loadAll().then( (requests) => {

    })
    
	});

	return api;
}

const errorDealer = (err, res) => {
  console.log(err.message, err.data)
  res.status(STATUS_SERVER_ERROR).send(err.message)
  res.end()
}


export default api