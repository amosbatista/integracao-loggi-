import { Router } from 'express'
import httpReq from 'superagent'
import notaryData from '../entities/notaryData'

export default ({ config, db }) => {
	let api = Router();

	// perhaps expose some API metadata at the root
	api.post('/', (req, res) => {
        const STATUS_UNAUTHORIZED = 401
        const STATUS_SERVER_ERROR = 500
        const apiId = req.get('Authorization')

        if(!apiId){
            res.status(STATUS_UNAUTHORIZED).send('Unauthenticated')
        }
        else{
            const query = {
                "city": 1,
                "package_type": "document",
                "payment_method": 3225,
                "transport_type": 1,
                "slo": 1,
                "waypoints": [
                    {
                        "by": "address",
                        "query": {
                            "address": req.body.streetName,
                            "address_complement": `${req.body.streetComplement}`,
                            "category": `${req.body.streetCategory}`,
                            "instructions": req.body.streetCategory,
                            "number": req.body.streetNumber
                        }
                    }
                ]
            }

            httpReq.post(process.env.LOGGI_API_V1 + "endereco/orcamento/")
                .query(query)
                .set('authorization', "Apikey amos.silva@gmail.com:dc94cab3d5f472f026964cbcb2af98dabaffce38")
                .end((err, apiRes) => {
                    
                    if(err){
                        console.log('Error at API new request', err.res.body)
                        res.status(STATUS_SERVER_ERROR).send('Error in client API request')
                        res.end()
                    }
                    else{
                        if(apiRes.body.errors.length >= 0){
                            res.status(STATUS_SERVER_ERROR).send('API request is done but there"s errors ')
                            console.log('Errors at API new request return', JSON.stringify(apiRes.body.errors))
                            res.end()
                        }
                        else{
                            res.json(apiRes.body)
                        }
                    }
                });
        }
	});

	return api;
}
