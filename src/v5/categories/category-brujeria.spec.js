import Service from './category-brujeria'
import mock from './mock/category-brujeria'

describe('categories brujeria service', () => {

  
  it('deve consultar CMS e retornar lista de CATEGORIA BRUJERIA', async () => {
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
      'description': 'Aprenda a fazer um incenso para sua meditação.',
      'id': '65e766c4147073b9b4e1bfb4',
      'thumb_alt': 'incenso acesso em um porta-incenso',
      'thumbnail': 'https://sundaypm.s4.fcomet.com/content/images/2024/03/incenso.png',
      'title': 'Como fazer um incenso?',
      'url': 'brujeria/como-fazer-um-incenso',
    });
    expect(expected[1]).toEqual({
      'description': "Quando, após anos de ceticismo, você resolve tentar e busca seus guias, e eles ficam um pouco empolgados quando descobrem que você chegou.",
      'id': '65da4ff8147073b9b4e1bd42',
      'thumb_alt': 'mulher loira com macacão, olhando para o alto',
      'thumbnail': 'https://sundaypm.s4.fcomet.com/content/images/2024/02/spiritual-guide.png',
      'title': 'quando você decidi ir atrás dos seus guias',
      'url': 'virtude/quando-voce-decidi-ir-atras-dos-seus-guias',
    });
    expect(expected[2]).toEqual({
      'description': 'O dia que visitei São Tomé das letras.',
      'id': '66666666666666666',
      'thumb_alt': 'Homem pardo em cima de um monte',
      'thumbnail': 'https://sundaypm.s4.fcomet.com/content/images/2024/02/sao-tome.png',
      'title': 'fui lá e voltei',
      'url': 'brujeria/sao-tome-das-letras',
    });
    expect(getMock).toBeCalledWith('http://sunday.com/ghost/api/v2/content/posts/?key=32kmn4o2i3j498j23e3&include=tags&filter=tag%3Abrujeria&limit=3')
  });
  
});