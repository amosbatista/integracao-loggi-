import { Router } from 'express'
import LoadUserMapper from '../db/mappers/load';
import SearchByEmailMapper from '../db/mappers/searchByEmail';

export default ({ config, db }) => {

	let api = Router();

	api.get('/', async (req, res) => {
    const STATUS_UNAUTHORIZED = 401
    const STATUS_SERVER_ERROR = 500

    const loadUserMapper = new LoadUserMapper();
    const users = await loadUserMapper.loadAll().catch((err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    });

    res.json(users)
    res.end()
  })

	return api;
}
