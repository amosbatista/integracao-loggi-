import { Router } from 'express'
import httpReq from 'superagent'
import query from './query/index'
import notaryData from '../entities/notaryData'


export default ({ config, db }) => {
	let api = Router();

	// perhaps expose some API metadata at the root
	api.post('/', (req, res) => {
        const STATUS_UNAUTHORIZED = 401
        const STATUS_SERVER_ERROR = 500
        const apiId = req.get('Authorization')
        const userLogin = req.get('UserLogin')

        if(!apiId){
            res.status(STATUS_UNAUTHORIZED).send('Unauthenticated')
        }
        else{
            console.log(JSON.stringify({
                query: query(req.body, notaryData)
            }))
            httpReq.post(process.env.LOGGI_API_V2)
                .query({
                    query: query(req.body, notaryData)
                })
                .set('authorization', `Apikey ${userLogin}:${apiId}`)
                .end((err, apiRes) => {
                    
                    if(err){
                        console.log('Error at API new request', err.res.body)
                        res.status(STATUS_SERVER_ERROR).send('Error in client API request')
                        res.end()
                    }
                    else{
                        res.json({
                            newRequestId: 1234
                        })
                        // if(apiRes.body.errors.length >= 0){
                        //     res.status(STATUS_SERVER_ERROR).send('API request is done but there"s errors ')
                        //     console.log('Errors at API new request return', JSON.stringify(apiRes.body.errors))
                        //     res.end()
                        // }
                        // else{
                        //     res.json({
                        //         newRequestId: apiRes.body
                        //     })
                        // }
                    }
                });
        }
	});

	return api;
}
