import Service from './aforismos-list-home.service'
import mock from './mock/category-aforismos'

describe('home aforismos service', () => {

  
  it('deve consultar CMS e retornar lista de AFORISMOS', async () => {
    process.env.NODE_ENV = 'dev';
    process.env.SUNDAY_API = 'http://sunday.com';
    process.env.SUNDAY_KEY = '32kmn4o2i3j498j23e3';
    

    const returnBody = {
      body: mock
    }
    const getMock = jest.fn().mockReturnValue({
      set: jest.fn().mockReturnValue({
        end: jest.fn((callback) => {
          callback(null, returnBody)
        })
      })
    });
    const requestfactory = () => {
      return {
        get: getMock
      }
    }
    const POST_LIMIT = 10;
    const expected = await Service(requestfactory(), POST_LIMIT);
    expect(expected[0]).toEqual({
      'content': 'hoje cedo, eu só sou mais um',
      'url': 'aforismos/hoje-cedo-eu-so-sou-mais-um',
    });
    expect(expected[1]).toEqual({
      'content': 'o homem sensato não destrói, apenas pergunta',
      'url': 'aforismos/o-homem-sensato-nao-destroi-apenas-pergunta',
    });
    expect(expected[2]).toEqual({
      'content': 'livro de bruxaria e cravo com café e cereveja',
      'url': 'aforismos/livro-bruxaria-2',
    });
    expect(getMock).toBeCalledWith('http://sunday.com/ghost/api/v2/content/posts/?key=32kmn4o2i3j498j23e3&include=tags&filter=tag%3Aaforismos&limit=10')
  });
  
});