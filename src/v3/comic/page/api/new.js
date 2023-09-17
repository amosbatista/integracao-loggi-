import { Router } from 'express'
import PageMapper from '../db/mappers/save'
import Base64ToBuffer from '../../../../v2/helpers/Base64ToBuffer';
import  uploadFileToS3 from '../../../aws/uploadFileToS3';
import { v4 } from 'uuid';

export default ({ config, db }) => {

	let api = Router();

	api.post('/', async (req, res) => {
    const STATUS_UNAUTHORIZED = 401
    const STATUS_SERVER_ERROR = 500

    if(!req.body.pageContent) {
      const err = "A página veio vazia.";
      console.log(err)
      res.status(STATUS_SERVER_ERROR).json(err)
      res.end()
      throw new Error(err)
    }

    if(!req.body.pageFileExtension) {
      const err = "o arquivo precisa vir com extensão.";
      res.status(STATUS_SERVER_ERROR).json(err)
      res.end()
      throw new Error(err)
    }

    const page = {
      comicId: req.body.comicId,
      pageContent:  Base64ToBuffer(req.body.pageContent),
      pagePosition: req.body.pagePosition,
      pageFileExtension: req.body.pageFileExtension,
    }
    if(!page.comicId) {
      const err = "O Id da obra é obrigatório."
      console.log(err)
      res.status(STATUS_SERVER_ERROR).json(err)
      res.end()
      throw new Error(err)
    }

    if(!page.pagePosition) {
      const err = "A posição da página é obrigatória."
      console.log(err)
      res.status(STATUS_SERVER_ERROR).json(err)
      res.end()
      throw new Error(err)
    }
    const pageHash = v4();
    const bucketData = await uploadFileToS3(page.pageContent, `comic_${pageHash}.${page.pageFileExtension}`).catch((err) => {
      console.log(err)
      res.status(STATUS_SERVER_ERROR).json(err)
      res.end()
      throw new Error(err)
    })    

    page.pageURL = bucketData.Location;

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