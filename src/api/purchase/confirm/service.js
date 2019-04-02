import httpReq from 'superagent'
import query from './query/index'
import notaryData from '../entities/notaryData'
import auth from '../../login/authorization'

const service = (req) => {

  return new Promise ( (resolve, reject) => {

    const authString = auth(req)

    if(!authString){
      reject({
        message: 'Unauthorized'
      })
    }

    httpReq.post(process.env.LOGGI_API_V2)
    .query({
      query: query(req.body, notaryData)
    })
    .set('authorization', auth(req))
    .end((err, apiRes) => {

      if(err){
        reject({
          message: 'Error in client API request',
          object: JSON.stringify(err)
        })
      }

      if(apiRes.body.errors.length >= 0){
        reject({
          message: 'API request is done but there"s errors ',
          object: JSON.stringify(apiRes.body.errors)
        })
      }

      resolve({
        newRequestId: apiRes.body
      })
    })
  })
}