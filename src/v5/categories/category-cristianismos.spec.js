import Service from './category-cristianismos'
import mock from './mock/category-cristianismos'

describe('categories CRISTIANISMOS service', () => {

  
  it('deve consultar CMS e retornar lista de CATEGORIA CRISTIANISMOS', async () => {
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
      'description': 'Deixa Deus operar!',
      'id': '65e1c9c5147073b9b4e1be97',
      'thumb_alt': 'Cristãos em transe no púlpito. Um pregador está com mãos na cabeça, outro rodando, uma irmã no fundo rodando',
      'thumbnail': 'https://sundaypm.s4.fcomet.com/content/images/2024/03/podem-falar-mal.png',
      'title': 'Mais um vídeo de poder da Assembleia dos Mistérios',
      'url': 'virtude/mais-um-video-de-poder-da-assembleia-dos-misterios',
    });
    expect(expected[1]).toEqual({
      'description': 'Gira de Umbanda? Não. É o poder do Senhor se manifestando nesta Assembléia de Deus dos Mistérios, em Mogi das Cruzes.',
      'id': '65e1c796147073b9b4e1be44',
      'thumb_alt': 'homem de óculos com roupas cobrindo o corpo, dançando com um microfone na mão',
      'thumbnail': 'https://sundaypm.s4.fcomet.com/content/images/2024/03/grandao-galileia.png',
      'title': 'Grandão da Galileia - O movimento é forte',
      'url': 'virtude/grandao-da-galileia',
    });
    expect(expected[2]).toEqual({
      'description': 'Outro vídeo de batismo no fogo, logo após o batismo com água.',
      'id': '65da4579147073b9b4e1bc03',
      'thumb_alt': 'Pastor segurando um jovem dentro do batistério.',
      'thumbnail': 'https://sundaypm.s4.fcomet.com/content/images/2024/02/outro-batismo-praise-break.png',
      'title': 'praise break',
      'url': 'virtude/depois-do-batismo-um-outro-batismo',
    });
    expect(getMock).toBeCalledWith('http://sunday.com/ghost/api/v2/content/posts/?key=32kmn4o2i3j498j23e3&include=tags&filter=tag%3Acristianismos&limit=3')
  });
  
});