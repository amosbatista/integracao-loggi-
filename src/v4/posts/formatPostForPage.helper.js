import moment from "moment";

export default (post) => {
  const { title,  feature_image, excerpt, slug, html, feature_image_alt, published_at, id  } = post;
  const dateFormat = 'DD/MM/YYYY'

  return { 
    title, 
    thumbnail: feature_image, 
    description: excerpt, 
    url: slug,
    content: html,
    thumb_alt: feature_image_alt,
    date: moment(published_at).format((dateFormat)),
    id
  };      
}