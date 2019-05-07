import { Router } from 'express'
import RequestListMapper from '../mapper/loadAll'

const api = ({ config, db }) => {

	let api = Router();

	api.post('/', (req, res) => {

    const requestListMapper = new RequestListMapper()
    requestListMapper.loadAll().then( (requests) => {

      res.json(requests)
      res.end()

      return
    }).catch((err) => {errorDealer(err, res)} )
    
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