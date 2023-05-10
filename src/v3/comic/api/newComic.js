import { Router } from 'express'
import ComicSaveMapper from '../db/mappers/save'
import PageMapper from '../page/db/mappers/save'
import Base64ToBuffer from '../../../v2/helpers/Base64ToBuffer';

export default ({ config, db }) => {

	let api = Router();

	api.post('/', async (req, res) => {
    const STATUS_UNAUTHORIZED = 401
    const STATUS_SERVER_ERROR = 500

    const comic = {
      creatorId: req.body.creatorId,
      name: req.body.name,
      description: req.body.description,
      frontPage: Base64ToBuffer(req.body.frontPage),
      pages: req.body.pages
    }
    if(!comic.creatorId) {
      console.log("O criador é obrigatório.")
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    }

    if(!comic.name) {
      console.log("O nome do quadrinho é obrigatório.")
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    }

    if(!comic.pages) {
      console.log("As páginas são obrigatórias.")
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    }

    const comicSaveMapper = new ComicSaveMapper();
    const savedComic = await comicSaveMapper.saveNew(comic).catch((err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    });;

    const pageMapper = new PageMapper();

    comic.pages.forEach(async page => {
      await pageMapper.saveNew({
        comicId: savedComic.id,
        pageContent: Base64ToBuffer(page)
      }).catch((err) => {
        console.log(err.message, err.data)
        res.status(STATUS_SERVER_ERROR).json(err.message)
        res.end()
        throw new Error(err.message)
      });
    });
    
    res.json("O quadrinho foi cadastrado com sucesso.")
    res.end()
  })

	return api;
}