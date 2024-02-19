export default (post) => {
  const { title,  feature_image, excerpt, slug } = post;
  
  return { 
    title, 
    thumbnail: feature_image, 
    description: excerpt, 
    slug 
  };      
}