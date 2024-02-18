import httpReq from 'superagent'
import formatHomePost from './formatHomePost'

const service = () => {

  return new Promise ((resolve, reject) => {

    const filters = "featured:true"
    const encodedFilters = encodeURIComponent(filters)
    const includes = 'tags';
    
    const url = `${process.env.SUNDAY_API}/ghost/api/v2/content/posts/?key=${process.env.SUNDAY_KEY}&include=${includes}&filter=${encodedFilters}`;

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

      resolve(formatHomePost(apiRes.body.posts[0]))
    })
  })
}

export default service