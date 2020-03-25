import { Router } from 'express'
import httpReq from 'superagent'

const api = () => {

	let api = Router(); 

	api.get('/', async (req, res) => {
    
        httpReq.get("http://teste-servico-sem-dominio-com-br.umbler.net")
        .send()
    
        .end((err, apiRes) => {
            if (err){
                res.json({
                    message: "not worked",
                    err
                })
            }
            else{
                res.json({
                    message: "the request to message worked. It will work",
                    apiRes
                })
                res.end()
            }
        })
        

        return
    
	});

	return api;
}

export default api