import { Router } from 'express'
import CreatorMapper from '../db/mappers/save'
import Base64ToBuffer from '../../../v2/helpers/Base64ToBuffer';

export default ({ config, db }) => {

	let api = Router();

	api.put('/', async (req, res) => {
    const STATUS_SERVER_ERROR = 500

    if(!req.body) {
      const message = 'Os dados do criador são obrigatórios.'
      console.log(message)
      res.status(STATUS_SERVER_ERROR).json(message)
      res.end()
      throw new Error(message)
    }

    const creator = {
      "id": req.body.id,
      "userId": req.body.userId,
      "description": req.body.description,
      "enabled": req.body.enabled,
      "avatar": Base64ToBuffer(req.body.avatar)
    };

    const creatorMaper = new CreatorMapper();
    await creatorMaper.update(creator).catch((err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    });

    res.json("Criador atualizado.")
    res.end()
  })

	return api;
}
