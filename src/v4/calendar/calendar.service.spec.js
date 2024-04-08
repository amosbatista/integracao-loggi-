import Service from './calendar.service';
import national from './mocks/national';

describe('serviço calendário', () => {
  it('serviço deve receber uma biblioteca para data', () => {
    const mock = jest.fn();
    const instance = Service(mock);

    expect(instance).toBeInstanceOf(Object);
  });

  it('deve receber uma data em formato de string e converter para o formato da biblioteca', () => {
    const dateLibMock = jest.fn().mockReturnValue('12/01/2024');
    const service = Service(dateLibMock);

    const dateToLoad = '2024-01-12';
    
    expect(service.setDateToLib(dateToLoad)).toBe('12/01/2024');
    expect(dateLibMock).toHaveBeenLastCalledWith(dateToLoad, 'YYYY-MM-DD');
    
  });

  it('deve retornar uma instância da data de hoje', () => {
    const dateLibMock = jest.fn().mockReturnValue('12/01/2020');
    const service = Service(dateLibMock);
    
    expect(service.getToday()).toBe('12/01/2020');    
  });

  it('deve receber uma data e retornar a diferença de hoje em horas', () => {
    const todayDiffToTest = 7;
    const dateDiffMock = jest.fn().mockReturnValue(todayDiffToTest);
    const dateLibMock = () => ({
      diff: dateDiffMock
    });
    const service = Service(dateLibMock);

    const dateToCompare = '2024-01-05'

    expect(service.getHoursRemaingToToday(dateToCompare)).toBe(7);
    expect(dateDiffMock).toHaveBeenLastCalledWith( {"diff": dateDiffMock}, 'hours');
  });

  it('deve receber um período de 24 horas e formatar para dias', () => {
    const service = Service();
    const hours = 24;

    expect(service.convertHoursToRemainingDays(hours)).toEqual(1);
  });

  it('deve receber um período um pouco maior que 1 dia e retornar um dia a mais', () => {
    const service = Service();
    const hours = 28;

    expect(service.convertHoursToRemainingDays(hours)).toEqual(2);

    const hours2 = 49;
    expect(service.convertHoursToRemainingDays(hours2)).toEqual(3);

    const hours3 = 123;
    expect(service.convertHoursToRemainingDays(hours3)).toEqual(6);
  });

  it('deve receber um período menor que 24 horas e retornar o mesmo valor', () => {
    const service = Service();
    const hours = 22;

    expect(service.convertHoursToRemainingDays(hours)).toEqual(22);
  });

  it('deve receber um valor de referência e retornar o mesmo valor, junto com o tipo de período "horas"', () => {
    const service = Service();
    const hours = 7;

    expect(service.getRemaingPeriod(hours)).toEqual({
      value: 7,
      type: 'hours'
    });
  });

  it('deve receber um valor de referência maior que 24 horas e retornar um tempo restante em dias', () => {
    const service = Service();
    const hours = 27;

    expect(service.getRemaingPeriod(hours)).toEqual({
      value: 2,
      type: 'days'
    });

    
  });

  it('deve receber um valor de hoars maior que 7 dias e retornar um tempo restante em semanas', () => {
    const service = Service();
    const hours = 24 * 7 * 3;

    expect(service.getRemaingPeriod(hours)).toEqual({
      value: 3,
      type: 'weeks'
    });
  });

  it('deve receber um valor de hoars maior que 30 dias e retornar um tempo restante em meses', () => {
    const service = Service();
    const hours = 24 * 7 * 30 * 10;

    expect(service.getRemaingPeriod(hours)).toEqual({
      value: 10,
      type: 'months'
    });
  });

  it('deve receber uma data sem o ano e deve retornar a instância, aplicando o ano atual na data', () => {
    const currentYear = 2001
    const yearMock = jest.fn().mockReturnValue(currentYear);
    const dateLibMock = () => ({
      year: yearMock
    });
    const service = Service(dateLibMock);

    const dateToLoad = '2024-01';
    
    expect(service.setDateToLib(dateToLoad)).toEqual({"year": yearMock});
  });

  it('deve receber um objeto de calendário e realizar sua formatação', () => {
    const currentYear = 2024;
    const yearMock = jest.fn().mockReturnValue(currentYear);
    
    const todayDiffToTest = 7 * 24 * 30 * 6;
    const dateDiffMock = jest.fn().mockReturnValue(todayDiffToTest);
    
    const dateLibMock = () => ({
      year: yearMock,
      diff: dateDiffMock
    });
    const service = Service(dateLibMock);

    const calendarObject = {
      date: '12-01',
      description: 'Creation of the world'
    };

    expect(service.parseCalendarObject(calendarObject)).toEqual({
      date: '12-01',
      description: 'Creation of the world',
      remainning: {
        value: 6,
        type: 'months'
      }
    })
  });

  it('deve receber um calendário e retornar a data mais próxima de hoje, sendo hoje, uma data mais próxima ao 2º item do mock', () => {
    const currentYear = 2024;
    const yearMock = jest.fn().mockReturnValue(currentYear);
    
    const firstDateHoursDiff = 24 * 7 * 30 * 12;
    const secondDateHoursDiff = 22;
    const thirdDateHoursDiff = 24 * 7 * 30 * 11;

    const dateDiffMock = jest.fn()
      .mockReturnValueOnce(firstDateHoursDiff)
      .mockReturnValueOnce(secondDateHoursDiff)
      .mockReturnValueOnce(thirdDateHoursDiff)
      .mockReturnValue(secondDateHoursDiff);
    
    const dateLibMock = jest.fn().mockReturnValue({
      year: yearMock,
      diff: dateDiffMock
    });
    const service = Service(dateLibMock);

    const calendar = national;

    expect(service.getTheNextDateInsideCalendar(calendar)).toEqual({
      date: '04-01',
      description: 'lie day',
      remainning: {
        value: 22,
        type: 'hours'
      }
    });      
  });
})