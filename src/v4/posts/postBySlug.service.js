import httpReq from 'superagent'
import formatHelper from './formatPostForPage.helper'
import slugService from '../navigation/slugService'

const service = (slug) => {

  return new Promise ((resolve, reject) => {

    const includes = 'tags';
    
    const url = `${process.env.SUNDAY_API}/ghost/api/v2/content/posts/slug/${slug}?key=${process.env.SUNDAY_KEY}&include=${includes}`;

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
        formatHelper(apiRes.body.posts[FIRST_POST])
      )
    })
  })
}

export default service