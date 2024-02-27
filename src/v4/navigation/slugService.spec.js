import slugService from './slugService';
import postListMock from './mock/mock_postList'
import mock_postList_2contextos from './mock/mock_postList_2contextos'
import mock_postlist_conteudoproprio from './mock/mock_postlist_conteudoproprio';

describe('slug service', () => {

  it('deve escolher a página pela tag', () => {
    const expected = slugService(postListMock.posts[0]);

    expect(expected.slug).toBe('virtude/fe-e-o-que-me-deixa-sao');
  });

  it('deve escolher a página pela tag, dando prioridade à ordem dos contextos', () => {
    const expected = slugService(mock_postList_2contextos.posts[0]);

    expect(expected.slug).toBe('cristianismos/fe-e-o-que-me-deixa-sao');
  });

  it('deve indicar página notícias caso não tenha objeto tags', () => {
    const expected = slugService(postListMock.posts[1]);

    expect(expected.slug).toBe('noticias/coming-soon');
  });

  it('deve indicar página notícias caso esteja sem tags', () => {
    const expected = slugService(postListMock.posts[2]);

    expect(expected.slug).toBe('noticias/felizes-estamos');
  });

  it('deve indicar página sem slug caso tenha a tag principal (conteúdo próprio)', () => {
    const expected = slugService(mock_postlist_conteudoproprio.posts[0]);

    expect(expected.slug).toBe('primeiro-video-tiktok');
  });
});