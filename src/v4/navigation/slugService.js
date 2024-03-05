import { MAIN_CONTEXTS } from "./contextsByTag.const";


export default (post) => {
  if(!post) {
    return {
      title: '',  
      feature_image: '', 
      excerpt: '',
      slug: '',
      feature_image_alt: '',
      id: ''
    }
  }
  if(!post.tags) {
    return {
      ...post,
      slug: `${MAIN_CONTEXTS.GERAL}/${post.slug}`
    };
  }
  if (post.tags.find(tag => (tag.name === MAIN_CONTEXTS.PRINCIPAL)) ) {
    return {
      ...post,
      slug: `${post.slug}`
    }
  }
  if (post.tags.find(tag => (tag.name === MAIN_CONTEXTS.VIRTUDE)) ) {
    return {
      ...post,
      slug: `${MAIN_CONTEXTS.VIRTUDE}/${post.slug}`
    }
  }
  if (post.tags.find(tag => (tag.name === MAIN_CONTEXTS.BRUJERIA)) ) {
    return {
      ...post,
      slug: `${MAIN_CONTEXTS.BRUJERIA}/${post.slug}`
    }
  }
  if (post.tags.find(tag => (tag.name === MAIN_CONTEXTS.CRISTIANISMOS)) ) {
    return {
      ...post,
      slug: `${MAIN_CONTEXTS.CRISTIANISMOS}/${post.slug}`
    }
  }
  if (post.tags.find(tag => (tag.name === MAIN_CONTEXTS.MALDITOS)) ) {
    return {
      ...post,
      slug: `${MAIN_CONTEXTS.MALDITOS}/${post.slug}`
    }
  }

  return {
    ...post,
    slug: `${MAIN_CONTEXTS.GERAL}/${post.slug}`
  };
};