import { Router } from 'express';
import apiVersion from './apiVersion';
import home from './home';
import postsApi from './posts';
import categories from './categories';

let api = Router();
	
api.use('/version', apiVersion());
api.use('/home', home());
api.use('/post', postsApi());
api.use('/categories', categories());

export default api;