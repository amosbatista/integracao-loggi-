import { Router } from 'express'
import ComicSaveMapper from '../db/mappers/save'
import Base64ToBuffer from '../../../v2/helpers/Base64ToBuffer';
import BufferToBase64 from '../../../v2/helpers/BufferToBase64';

export default ({ config, db }) => {

	let api = Router();

	api.put('/', async (req, res) => {
    const STATUS_UNAUTHORIZED = 401
    const STATUS_SERVER_ERROR = 500

    const comic = {
      id: req.body.id,
      creatorId: req.body.creatorId,
      name: req.body.name,
      description: req.body.description,
      frontPage: Base64ToBuffer(req.body.frontPage),
    }
    if(!comic.creatorId) {
      const message = "O criador é obrigatório.";
      console.log(message)
      res.status(STATUS_SERVER_ERROR).json(message)
      res.end()
      throw new Error(message)
    }

    if(!comic.name) {
      const message = "O nome do quadrinho é obrigatório.";
      console.log(message)
      res.status(STATUS_SERVER_ERROR).json(message)
      res.end()
      throw new Error(message)
    }

    const comicSaveMapper = new ComicSaveMapper();
    const savedComic = await comicSaveMapper.update(comic).catch((err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    });

    savedComic.frontPage = BufferToBase64(savedComic.frontPage)
    
    res.json(savedComic)
    res.end()
  })

	return api;
}