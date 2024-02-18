export default (post) => {
  const { title,  feature_image, excerpt, slug } = post;
  
  return { title,  feature_image, excerpt, slug };      
}