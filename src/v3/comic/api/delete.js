import { Router } from 'express'
import ComicDeleteMapper from '../db/mappers/delete'
import PageDeleteMapper from '../page/db/mappers/delete'

export default ({ config, db }) => {

	let api = Router();

	api.delete('/', async (req, res) => {
    const STATUS_UNAUTHORIZED = 401
    const STATUS_SERVER_ERROR = 500

    if(!req.query.comicId) {
      const message = "A obra é obrigatória.";
      console.log(message)
      res.status(STATUS_SERVER_ERROR).json(message)
      res.end()
      throw new Error(message)
    }

    const pageDeleteMapper = new PageDeleteMapper();
    await pageDeleteMapper.deleteFromComic(req.query.comicId).catch((err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    });

    const comicDeleteMapper = new ComicDeleteMapper();
    await comicDeleteMapper.delete(req.query.comicId).catch((err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    });
    
    res.json("Obra foi excluída com sucesso.")
    res.end()
  })

	return api;
}