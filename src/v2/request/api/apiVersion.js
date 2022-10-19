import { Router } from 'express'

export default ({ config, db }) => {

  const VERSION = '2.1.2';

	let api = Router();

	api.get('/', async (req, res) => {
    
    
    res.json({
      version: VERSION
    })
    res.end()
    
  })
  
  return api;
}