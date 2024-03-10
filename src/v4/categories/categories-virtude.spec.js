import Service from './categories-virtude'
import mock from './mock/category-virtude'

describe('categories virtude service', () => {

  
  it('deve consultar CMS e retornar lista de CATEGORIA VIRTUDE', async () => {
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
    const POST_LIMIT = 3;
    const expected = await Service(requestfactory(), POST_LIMIT);
    expect(expected[0]).toEqual({
      'description': 'Poder sobrenatural ou simples psicose',
      'id': '65e76a5d147073b9b4e1bfda',
      'thumb_alt': 'Mulher branca de óculos, conversando',
      'thumbnail': 'https://sundaypm.s4.fcomet.com/content/images/2024/03/psicose-espiritual.png',
      'title': 'Sobre psicose espiritual',
      'url': 'noticias/sobre-psicose-espiritual',
    });
    expect(expected[1]).toEqual({
      'description': 'Será que é algo tão perigoso assim?',
      'id': '65e763dd147073b9b4e1bf3f',
      'thumb_alt': 'Culto no lar, onde pessoas estão louvando, e outras estão possuídas, deitadas no tatame.',
      'thumbnail': 'https://sundaypm.s4.fcomet.com/content/images/2024/03/coreia-perigo.png',
      'title': 'cuidado com seitas na Coréia (?)',
      'url': 'noticias/cuidado-com-seitas-na-coreia',
    });
    expect(expected[2]).toEqual({
      'description': 'Deixa Deus operar!',
      'id': '65e1c9c5147073b9b4e1be97',
      'thumb_alt': 'Cristãos em transe no púlpito. Um pregador está com mãos na cabeça, outro rodando, uma irmã no fundo rodando',
      'thumbnail': 'https://sundaypm.s4.fcomet.com/content/images/2024/03/podem-falar-mal.png',
      'title': 'Mais um vídeo de poder da Assembleia dos Mistérios',
      'url': 'noticias/mais-um-video-de-poder-da-assembleia-dos-misterios',
    });
    expect(getMock).toBeCalledWith('http://sunday.com/ghost/api/v2/content/posts/?key=32kmn4o2i3j498j23e3&include=tags&filter=tag%3Avirtude&limit=3')
  });
  
});