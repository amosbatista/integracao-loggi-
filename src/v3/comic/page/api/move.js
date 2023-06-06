import { Router } from 'express'
import PageMapper from '../db/mappers/save'

export default ({ config, db }) => {

	let api = Router();

	api.patch('/', async (req, res) => {
    const STATUS_UNAUTHORIZED = 401
    const STATUS_SERVER_ERROR = 500


    if(!req.body.pageFrom) {
      console.log("A definição da página anterior é obrigatória.")
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    }

    if(!req.body.pageTo) {
      console.log("A definição da próxima página é obrigatória.")
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    }

    const pageMapper = new PageMapper();

    await pageMapper.movePosition(req.body.pageFrom, req.body.pageTo).catch((err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    });

    
    res.json("A página foi movida com sucesso.")
    res.end()
  })

	return api;
}