import httpReq from 'superagent'

const service = () => {

  return new Promise ((resolve, reject) => {

    const fields = "title,url,custom_excerpt,slug"
    const filters = "featured:true"
    const encodedFilters = encodeURIComponent(filters)
    
    const url = `${process.env.SUNDAY_API}/ghost/api/v2/content/posts/?key=${process.env.SUNDAY_KEY}&fields=${fields}&filter=${encodedFilters}`;

    httpReq.get(url)
    .set('Content-Type', "application/json")

    .end((err, apiRes) => {

      if(err){
        reject({
          message: "Erro requisição API sunday",
          data: err
        })
        return
      }
      resolve(apiRes.body)
    })
  })
}

export default service