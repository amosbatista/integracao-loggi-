import httpReq from 'superagent'
import encoder from '../helpers/encoderURL'

const service = (address) => {

  return new Promise ((resolve, reject) => {
    const key = process.env.GOOGLE_API_KEY
    httpReq.get(`${process.env.GOOGLE_GEOCODE_API}?address=${encoder(address)}&key=${key}`)
    .set('Content-Type', "application/json")
    .end((err, apiRes) => {
      
      if(err){
        reject({
          message: "Erro ao fazer geolocalização",
          data: err
        })
      }
      resolve(apiRes.body.results[0].geometry.location)
    })
  })
}

export default service