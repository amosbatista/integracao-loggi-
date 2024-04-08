import Service from './cache.service'

describe('cache service', () => {

  
  it('deve salvar uma informação no cache, informando o tempo inicial do cache', async () => {
    const objToStore = {
      foo: 'bar'
    };
    const hours = 12;
    const libMock = {
      set: jest.fn().mockReturnValue({
        stored: {
          foo: 'bar',
        },
        createdAt: '2024-03-21T12:44:56-03:00',
      })
    }
    const dateLibMock = () => ({
      format: () => ('2024-03-21T12:44:56-03:00')
    })
    const key = 'my_key'
    const service = Service(libMock, dateLibMock)
    const result = service.set(key, objToStore, hours, 202) ;

    expect(result).toEqual({
      stored: {
        foo: 'bar',
      },
      createdAt: '2024-03-21T12:44:56-03:00',
      ttl: 43200,
    });
    expect(libMock.set).toBeCalledWith("my_key", {
      stored: {
        foo: 'bar',
      },
      createdAt: '2024-03-21T12:44:56-03:00',
      "ttl": 43200,
    },
    43200);
  });

  it('deve carregar um cache informado, informando o tempo original e restante', async () => {
    const libMock = {
      get: jest.fn().mockReturnValue({
        stored: '{\"foo\":\"bar\"}',
        createdAt: '2024-03-21T12:44:56-03:00',
        "ttl": 43200,
      })
    }
    const key = 'my_key'
    const diffMock = jest.fn().mockReturnValue(12)
    const dateLibMock = () => ({
      diff: diffMock
    });
    const service = Service(libMock, dateLibMock);

    expect(service.get(key)).toEqual({
      stored: {
        foo: 'bar',
      },
      createdAt: '2024-03-21T12:44:56-03:00',
      ttl: 43188,
    });
  });

  it('deve retornar nulo, quando não conseguir salvar um cache', () => {
    const objToStore = {
      foo: 'bar'
    };
    const hours = 12;
    const libMock = {
      set: jest.fn().mockReturnValue(undefined)
    }
    const dateLibMock = () => ({
      format: () => ('2024-03-21T12:44:56-03:00')
    })
    const key = 'my_key'
    const service = Service(libMock, dateLibMock)
    const result = service.set(key, objToStore, hours);

    expect(result).toEqual(null);
    expect(libMock.set).toBeCalledWith("my_key", {
      stored: {
        foo: 'bar',
      },
      createdAt: '2024-03-21T12:44:56-03:00',
      "ttl": 43200
    },
    43200);
  });

  it('deve retornar nulo quando não conseguir carregar um cache', () => {
    const libMock = {
      get: jest.fn().mockReturnValue(undefined)
    }
    const key = 'my_key'
    const diffMock = jest.fn().mockReturnValue(3333121)
    const dateLibMock = () => ({
      diff: diffMock
    });
    const service = Service(libMock, dateLibMock);

    expect(service.get(key)).toEqual(null);
  })
  
});