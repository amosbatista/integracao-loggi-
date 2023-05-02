import { Router } from 'express'

export default ({ config, db }) => {

  const VERSION = '0.0.1';

	let api = Router();

	api.get('/', async (req, res) => {
    
    
    res.json({
      version: VERSION
    })
    res.end()
    
  })
  
  return api;
}