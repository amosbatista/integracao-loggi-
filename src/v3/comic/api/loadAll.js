import { Router } from 'express'
import ComicLoadMapper from '../db/mappers/load'

export default ({ config, db }) => {

	let api = Router();

	api.get('/', async (req, res) => {
    const STATUS_UNAUTHORIZED = 401
    const STATUS_SERVER_ERROR = 500

    const comicLoadMapper = new ComicLoadMapper();
    const allComics = await comicLoadMapper.loadAll().catch((err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    });
    
    const allComicsFormatted = allComics.map(comic => {
      
      return comic
    });

    res.json(allComics)
    res.end()
  })

	return api;
}