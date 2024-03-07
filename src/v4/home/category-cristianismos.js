import httpReq from 'superagent'
import formatHomePost from '../formatPostModel'
import slugService from '../navigation/slugService'

const service = (
  req = httpReq,
  categoriesLimit
) => {

  return new Promise ((resolve, reject) => {

    const filters = "tag:cristianismos"
    const encodedFilters = encodeURIComponent(filters)
    const includes = 'tags';
    
    const url = `${process.env.SUNDAY_API}/ghost/api/v2/content/posts/?key=${process.env.SUNDAY_KEY}&include=${includes}&filter=${encodedFilters}&limit=${categoriesLimit}`;

    req.get(url)
    .set('Content-Type', "application/json")

    .end((err, apiRes) => {

      if(err){
        reject({
          message: "Erro requisição API sunday (Categoria - Virtude)",
          data: err
        })
        return
      }

      resolve(
        apiRes.body.posts.map((post) => {
          return formatHomePost(
            slugService(post)
          )
        })
      )
    })
  })
}

export default service