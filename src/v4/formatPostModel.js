export default (post) => {
  const { title,  feature_image, excerpt, slug, feature_image_alt, id } = post;
  
  return { 
    title, 
    thumbnail: feature_image, 
    thumb_alt: feature_image_alt,
    description: excerpt, 
    url: slug,
    id
  };      
}