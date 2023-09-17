import { Router } from 'express'
import ComicSaveMapper from '../db/mappers/save'
import { v4 } from 'uuid';
import uploadFileToS3 from '../../aws/uploadFileToS3';
import Base64ToBuffer from '../../../v2/helpers/Base64ToBuffer';

export default ({ config, db }) => {

	let api = Router();

	api.post('/', async (req, res) => {
    const STATUS_UNAUTHORIZED = 401
    const STATUS_SERVER_ERROR = 500

    if(!req.body.creatorId) {
      const message = "O criador é obrigatório.";
      res.status(STATUS_SERVER_ERROR).json(message)
      res.end()
      throw new Error(message)
    }

    if(!req.body.name) {
      const message = "O nome do quadrinho é obrigatório.";
      console.log(message)
      res.status(STATUS_SERVER_ERROR).json(message)
      res.end()
      throw new Error(message)
    }

    if(!req.body.pageFileExtension) {
      const message = "A extensão da capa é obrigatório.";
      console.log(message)
      res.status(STATUS_SERVER_ERROR).json(message)
      res.end()
      throw new Error(message)
    }

    if(!req.body.frontPage) {
      const message = "A capa é obrigatória.";
      console.log(message)
      res.status(STATUS_SERVER_ERROR).json(message)
      res.end()
      throw new Error(message)
    }

    const pageFileContent = Base64ToBuffer(req.body.frontPage);
    
    const pageHash = v4();
    const fileName = `frontpage_${pageHash}.${req.body.pageFileExtension}`;

    
    const bucketData = await uploadFileToS3(pageFileContent, fileName).catch((err) => {
      console.log(err)
      res.status(STATUS_SERVER_ERROR).json(err)
      res.end()
      throw new Error(err)
    })  
    const pageURL = bucketData.Location;

    const comic = {
      creatorId: req.body.creatorId,
      name: req.body.name,
      description: req.body.description,
      url: pageURL,
      enabled: true,
      fileName
    }
  
    const comicSaveMapper = new ComicSaveMapper();
    const savedComic = await comicSaveMapper.saveNew(comic).catch((err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    });

    savedComic.url = pageURL

    res.json(savedComic)
    res.end()
  })

	return api;
}