import { Router } from 'express'
import PageMapper from '../db/mappers/save'
import Base64ToBuffer from '../../../../v2/helpers/Base64ToBuffer';

export default ({ config, db }) => {

	let api = Router();

	api.post('/', async (req, res) => {
    const STATUS_UNAUTHORIZED = 401
    const STATUS_SERVER_ERROR = 500

    if(!req.body.pageContent) {
      console.log("A página veio vazia.")
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    }

    const page = {
      comicId: req.body.comicId,
      pageContent:  Base64ToBuffer(req.body.pageContent),
      pagePosition: req.body.pagePosition,
    }
    if(!page.comicId) {
      console.log("O Id da obra é obrigatório.")
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    }

    if(!page.pagePosition) {
      console.log("A posição da página é obrigatória.")
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    }

    const pageMapper = new PageMapper();

    await pageMapper.saveNew(page).catch((err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    });

    
    res.json("A página foi salva com sucesso.")
    res.end()
  })

	return api;
}