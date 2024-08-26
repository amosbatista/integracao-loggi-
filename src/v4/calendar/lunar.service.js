import httpReq from 'superagent'

const service = (
  req = httpReq,
) => {

  return new Promise ((resolve, reject) => {

    const url = `https://ec3iktm48f.execute-api.us-east-1.amazonaws.com/default/MoonPhases`;

    req.get(url)
    .set('Content-Type', "application/json")
    .end((err, apiRes) => {
      console.log('lunar', apiRes)
      if(err){
        reject({
          message: `Erro requisição calendário lunar`,
          data: err
        })
        return
      }

      resolve(apiRes.body)
    })
  })
}

export default service