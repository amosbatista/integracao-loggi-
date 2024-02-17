import httpReq from 'superagent'

const service = () => {

  return new Promise ((resolve, reject) => {

    const TOP_LIMIT_POSTS = 4;
    const TAG = 'top';

    const fields = "title,url,custom_excerpt,slug,feature_image,feature_image_alt,featured"
    const filters = `tag:${TAG}`
    const encodedFilters = encodeURIComponent(filters)
    
    const url = `${process.env.SUNDAY_API}/ghost/api/v2/content/posts/?key=${process.env.SUNDAY_KEY}&limit=${TOP_LIMIT_POSTS}&fields=${fields}&filter=${encodedFilters}`;

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
      const res = apiRes.body.posts;
      
      resolve({
        featured: res.find(post => (post.featured)),
        others: res.filter(post => (!post.featured))
      })
    })
  })
}

export default service