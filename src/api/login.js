import { Router } from 'express';
import httpReq from 'superagent';

const validate = (login, password) => {
    return login != '' && password != ''
}
export default ({ config, db }) => {
	let api = Router();

	// perhaps expose some API metadata at the root
	api.post('/', (req, res) => {
        const login = req.body.login
        const password = req.body.password
        const STATUS_UNAUTHORIZED = 401

        if(!validate(login, password)){
            res.status(STATUS_UNAUTHORIZED).send('Wrong password or login')
        }
        else{
            httpReq.post(process.env.LOGGI_API_V2)
                .query({query:'mutation { login(input:{email: \"' + login + '\", password: \"' + password + '\" }) { user { apiKey } } }'})
                .end((err, apiRes) => {
                    if(err){
                        res.status(STATUS_UNAUTHORIZED).send('Error in client API request')
                    }
                    else{

                        const resData = JSON.parse(apiRes.text)

                        try{
                            const apiId = resData.data.login.user.apiKey
                            res.json({
                                apiId: apiId
                            })
                        }
                        catch(err){
                            res.status(STATUS_UNAUTHORIZED).send('It was impossible to generate user key. Check your password or login')
                        }
                    }
                });
        }
	});

	return api;
}
