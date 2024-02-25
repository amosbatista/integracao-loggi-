import { Router } from 'express'

export default ({ config, db }) => {

  const VERSION = '1.3';

	let api = Router();

	api.get('/', async (req, res) => {
    
    
    res.json({
      version: VERSION
    })
    res.end()
    
  })
  
  return api;
}