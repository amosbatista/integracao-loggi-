import httpReq from 'superagent'
import slugService from '../navigation/slugService'

const service = (
  req = httpReq,
  categoriesLimit,
) => {

  return new Promise ((resolve, reject) => {

    const TAG_PICK = 'sunday6pm_pick_top'
    const filters = `tag:${TAG_PICK}`
    const encodedFilters = encodeURIComponent(filters)
    const includes = 'tags';
    
    const url = `${process.env.SUNDAY_API}/ghost/api/v2/content/posts/?key=${process.env.SUNDAY_KEY}&include=${includes}&filter=${encodedFilters}&limit=${categoriesLimit}`;

    req.get(url)
    .set('Content-Type', "application/json")

    .end((err, apiRes) => {

      if(err){
        reject({
          message: `Erro requisição API sunday (Categoria - ${filters})`,
          data: err
        })
        return
      }

      resolve(
        apiRes.body.posts.map((post) => {

          const {  title,  feature_image, excerpt, slug, feature_image_alt, id } = slugService(post);
  
          return { 
            title, 
            thumbnail: feature_image,
            thumb_alt: feature_image_alt,
            description: excerpt || title,
            url: slug,
            id
          }
        })
      )
    })
  })
}

export default service