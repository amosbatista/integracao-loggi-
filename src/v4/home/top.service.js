import httpReq from 'superagent'
import formatHomePost from './formatHomePost';

const service = () => {

  return new Promise ((resolve, reject) => {

    const TOP_LIMIT_POSTS = 4;
    const TAG = 'top';
    const TAG_FEATURED = 'top_featured';
    const includes = 'tags';
    const filters = `tag:${TAG},tag:${TAG_FEATURED}`
    const encodedFilters = encodeURIComponent(filters)
    
    const url = `${process.env.SUNDAY_API}/ghost/api/v2/content/posts/?key=${process.env.SUNDAY_KEY}&include=${includes}&limit=${TOP_LIMIT_POSTS}&filter=${encodedFilters}`;
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

      const featured = res.find(post => (
        post.tags.find(tags => (
          tags.name === TAG_FEATURED
        ))
      ));

      resolve({
        featured: formatHomePost(featured),
        others: res
          .filter(post => (
            post.id !== featured.id))
          .reduce((final, post) => {
            final.push (formatHomePost(post));
            return final;
          }, [])
      })
    })
  })
}

export default service