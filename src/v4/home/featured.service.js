import httpReq from 'superagent'
import formatHomePost from '../formatPostModel'
import slugService from '../navigation/slugService'

const service = () => {

  return new Promise ((resolve, reject) => {

    const filters = "featured:true"
    const encodedFilters = encodeURIComponent(filters)
    const includes = 'tags';
    
    const url = `${process.env.SUNDAY_API}/ghost/api/vx/content/posts/?key=${process.env.SUNDAY_KEY}&include=${includes}&filter=${encodedFilters}`;

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

      const FIRST_POST = 0

      resolve(
        formatHomePost(
          slugService(apiRes.body.posts[FIRST_POST])
        )
      )
    })
  })
}

export default service