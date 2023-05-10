import { Router } from 'express'
import ComicLoadMapper from '../db/mappers/load'
import PageLoadMapper from '../page/db/mappers/load'
import BufferToBase64 from '../../../v2/helpers/BufferToBase64';

export default ({ config, db }) => {

	let api = Router();

	api.get('/', async (req, res) => {
    const STATUS_UNAUTHORIZED = 401
    const STATUS_SERVER_ERROR = 500

    const comicId = req.query.comicId;

    if(!comicId) {
      console.log("A obra é obrigatória.")
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    }

    const comicLoadMapper = new ComicLoadMapper();
    const comic = await comicLoadMapper.load(comicId).catch((err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    });

    const pageLoadMapper = new PageLoadMapper();
    const allPagesFromComic = await pageLoadMapper.loadAllFromComic(comicId);

    const allPagesFormatted = allPagesFromComic.map(page => {
      return BufferToBase64(page.pageContent)
    });

    res.json({
      "id": comic.id,
      "creatorId": comic.creatorId,
      "name": comic.name,
      "description": comic.description,
      "enabled": comic.enabled,
      "frontPage": BufferToBase64(comic.frontPage),
      pages: allPagesFormatted
    })
    res.end()
  })

	return api;
}