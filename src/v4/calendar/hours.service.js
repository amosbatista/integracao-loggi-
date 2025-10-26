import httpReq from 'superagent'

const service = (
  req = httpReq,
) => {

  return new Promise ((resolve, reject) => {

    const url = `https://8uig3g5eh7.execute-api.us-east-1.amazonaws.com/dev/hours`;

    req.get(url)
    .set('Content-Type', "application/json")
    .end((err, apiRes) => {
      if(err){
        reject({
          message: `Erro requisição calendário lunar`,
          data: err
        })
        return
      }

      resolve(JSON.parse(apiRes.text))
    })
  })
}

export default service