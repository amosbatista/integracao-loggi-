import Service from './category-aforismos.service'
import mock from './mock/category-aforismos'

describe('home aforismos service', () => {

  
  it('deve consultar CMS e retornar categoria de AFORISMOS', async () => {
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
      'description': 'hoje cedo, eu só sou mais um',
      'id': '66095ad90125b729f8c09851',
      'thumb_alt': null,
      'thumbnail': null,
      'title': 'hoje cedo, eu só sou mais um',
      'url': 'aforismos/hoje-cedo-eu-so-sou-mais-um',
    });
    expect(expected[1]).toEqual({
      'description': 'o homem sensato não destrói, apenas pergunta',
      'id': '66095ab20125b729f8c09849',
      'thumb_alt': null,
      'thumbnail': null,
      'title': 'o homem sensato não destrói, apenas pergunta',
      'url': 'aforismos/o-homem-sensato-nao-destroi-apenas-pergunta',
    });
    expect(expected[2]).toEqual({
      'description': 'FOO BAR MIMOSO GRÃO DE ARROZ',
      'id': '666666',
      'thumb_alt': 'Imagem de um livro de bruxaria em cima de uma mesa',
      'thumbnail': 'https://sundaypm.s4.fcomet.com/content/images/2024/03/podem-falar-mal.png',
      'title': 'livro de bruxaria e cravo com café e cereveja',
      'url': 'aforismos/livro-bruxaria-2',
    });
    expect(getMock).toBeCalledWith('http://sunday.com/ghost/api/v2/content/posts/?key=32kmn4o2i3j498j23e3&include=tags&filter=tag%3Aaforismos&limit=10')
  });
  
});