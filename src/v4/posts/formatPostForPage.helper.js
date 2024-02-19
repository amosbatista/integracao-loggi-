export default (post) => {
  const { title,  feature_image, excerpt, slug, html, feature_image_alt  } = post;
  
  return { 
    title, 
    thumbnail: feature_image, 
    description: excerpt, 
    url: slug,
    content: html,
    thumb_alt: feature_image_alt
  };      
}