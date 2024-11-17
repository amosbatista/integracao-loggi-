import httpReq from 'superagent'

const service = (
  req = httpReq,
) => {

  return new Promise ((resolve, reject) => {

    const url = `https://fmoduy3rog.execute-api.us-east-1.amazonaws.com/default/Judaic`;

    req.get(url)
    .set('Content-Type', "application/json")
    .end((err, apiRes) => {

      if(err){
        reject({
          message: `Erro requisição calendário judaico`,
          data: err
        })
        return
      }

      resolve(JSON.parse(apiRes.text))
    })
  })
}

export default service