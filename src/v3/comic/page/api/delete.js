import { Router } from 'express'
import PageMapper from '../db/mappers/delete'

export default ({ config, db }) => {

	let api = Router();

	api.delete('/', async (req, res) => {
    const STATUS_UNAUTHORIZED = 401
    const STATUS_SERVER_ERROR = 500


    if(!req.query.id) {
      console.log("O id da página é obrigatório.")
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    }


    const pageMapper = new PageMapper();

    await pageMapper.delete(req.query.id).catch((err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    });

    
    res.json("A página foi deletada com sucesso.")
    res.end()
  })

	return api;
}