const MAIN_CONTEXTS = {
  VIRTUDE: 'virtude', 
  CRISTIANISMOS: 'cristianismos', 
  MALDITOS: 'malditos',
  GERAL: 'noticias'
};

export default (post) => {

  if(!post.tags) {
    return {
      ...post,
      slug: `${MAIN_CONTEXTS.GERAL}/${post.slug}`
    };
  }
  if (post.tags.find(tag => (tag.name === MAIN_CONTEXTS.VIRTUDE)) ) {
    return {
      ...post,
      slug: `${MAIN_CONTEXTS.VIRTUDE}/${post.slug}`
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