import service from '../../../../api/purchase/confirm/service'
import chai from 'chai'

let expect = chai.expect

describe('Purchase confirmation address component test', () => {

  it('should be a function that receives address parameters and returns a string with its data', () => {
    expect(addressComponent).to.be.a('function')

    const adressDataTest = {
      streetNumber: '123',
      streetName: 'Rua Igor Tavares',
      neighborhood: 'Parque Foobar',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brasil',
      countryShortName: 'BR',
      postalCode: '001122122'
    }

    const expected = `{
    addressComponents: [
      {longName: "123", shortName: "123", types: ["street_number"]}, 
      {longName: "Rua Igor Tavares", shortName: "Rua Igor Tavares", types: ["route"]}, 
      {longName: "Parque Foobar", shortName: "Parque Foobar", types: ["neighborhood", "political"]}, 
      {longName: "São Paulo", shortName: "São Paulo", types: ["locality", "political"]}, 
      {longName: "SP", shortName: "SP", types: ["administrative_area_level_2", "political"]},
      {longName: "SP", shortName: "SP", types: ["administrative_area_level_1", "political"]}, 
      {longName: "Brasil", shortName: "BR", types: ["country", "political"]}, 
      {longName: "001122122", shortName: "001122122", types: ["postal_code"]}
    ], 
    formattedAddress: "Rua Igor Tavares, 123 - Parque Foobar, São Paulo - SP, 001122122, Brasil",
    types: ["street_address"]
  }`

    expect(addressComponent(adressDataTest)).be.deep.equal(expected)
  })

})