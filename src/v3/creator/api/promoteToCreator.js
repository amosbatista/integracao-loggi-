import { Router } from 'express'
import UserMapper from '../../auth/db/mappers/save'
import CreatorSaveMapper from '../db/mappers/save'
import CreatorLoadMapper from '../db/mappers/load'

export default ({ config, db }) => {

	let api = Router();

	api.patch('/', async (req, res) => {
    const STATUS_SERVER_ERROR = 500

    if(!req.query.userId) {
      const message = 'O ID é obrigatório.'
      console.log(message)
      res.status(STATUS_SERVER_ERROR).json(message)
      res.end()
      throw new Error(message)
    }

    const userId = req.query.userId;

    const userMapper = new UserMapper(); 
    await userMapper.promoteToCreator(userId).catch((err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    });;

    const creatorLoadMapper = new CreatorLoadMapper();    
    const mustHaveCreator = await creatorLoadMapper.loadByUserId(userId).catch((err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    });;
  
    const creatorSaveMapper = new CreatorSaveMapper();

    if(!mustHaveCreator){
      await creatorSaveMapper.saveNew({
        userId
      }).catch((err) => {
        console.log(err.message, err.data)
        res.status(STATUS_SERVER_ERROR).json(err.message)
        res.end()
        throw new Error(err.message)
      });
    }

    else {
      mustHaveCreator.enabled = true;
      
      await creatorSaveMapper.update(mustHaveCreator).catch((err) => {
        console.log(err.message, err.data)
        res.status(STATUS_SERVER_ERROR).json(err.message)
        res.end()
        throw new Error(err.message)
      });
    }
    
    res.json("Usuário promovido para criador.")
    res.end()
  })

	return api;
}
