import { Router } from 'express'

import LoadUserMapper from '../db/mappers/load';
import CreatorMapper from '../../creator/db/mappers/load';

import TYPES from '../db/types';
import SearchByEmailMapper from '../db/mappers/searchByEmail';
import BufferToBase64 from '../../../v2/helpers/BufferToBase64';

export default ({ config, db }) => {

	let api = Router();

	api.get('/', async (req, res) => {
    const STATUS_UNAUTHORIZED = 401
    const STATUS_SERVER_ERROR = 500

    const id = req.query.userId

     if(!id) {
      const message = 'O Id é obrigatório.'
      console.log(message)
      res.status(STATUS_UNAUTHORIZED).json(message)
      res.end()
      throw new Error(message)
    }

    const loadUserMapper = new LoadUserMapper();
    const user = await loadUserMapper.load(id).catch((err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    });

    if(user.userType === TYPES.CREATOR) {
      const creatorMapper = new CreatorMapper();

      const userCreator = await creatorMapper.loadByUserId(id).catch((err) => {
        console.log(err.message, err.data)
        res.status(STATUS_SERVER_ERROR).json(err.message)
        res.end()
        throw new Error(err.message)
      });

      user.creator = {
        "id": userCreator.id,
        "userId": userCreator.userId,
        "description": userCreator.description,
        "enabled": userCreator.enabled,
        "avatar": BufferToBase64(userCreator.avatar)
      }
    }

    res.json(user)
    res.end()
  })

	return api;
}
