import httpReq from 'superagent'
import query from './query/index'
import notaryData from '../../entities/notaryData'

const service = (addressData, auth) => {

  return new Promise ( (resolve, reject) => {

    resolve({
      "newRequestId": '12345abc'
    })
    return

    httpReq.post(process.env.LOGGI_API_V2)
    .send({
      query: query(addressData, notaryData)
    })
    .set('authorization', auth)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
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
      else{
        resolve({
          newRequestId: apiRes.body.data.createOrderInquiry
        })
      }
    })
  })
}

export default service