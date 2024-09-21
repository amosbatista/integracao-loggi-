import httpReq from 'superagent'
import formatHomePost from '../formatPostModel'
import slugService from '../navigation/slugService'

const highlights = (
  req = httpReq
) => {

  return new Promise ((resolve, reject) => {

    const HIGHLIGHT_LIMIT = 8;

    const filters = "tag:highlights"
    const encodedFilters = encodeURIComponent(filters)
    const includes = 'tags';
    
    const url = `${process.env.SUNDAY_API}/ghost/api/v2/content/posts/?key=${process.env.SUNDAY_KEY}&include=${includes}&filter=${encodedFilters}`;

    req.get(url)
    .set('Content-Type', "application/json")

    .end((err, apiRes) => {

      if(err){
        reject({
          message: "Erro requisição API sunday (Highlights)",
          data: err
        })
        return
      }

      resolve(
        apiRes.body.posts.map((post: any) => {
          return formatHomePost(
            slugService(post)
          )
        }).slice(0, HIGHLIGHT_LIMIT - 1)
      )
    })
  })
}

export default highlights