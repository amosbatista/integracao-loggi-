import notaryData from '../../../api/entities/notaryData'
import chai from 'chai'

let expect = chai.expect

describe('Notary data test', () => {

  it('should be an object', () => {
    expect(notaryData).to.be.an('object')
  })

  it('entity should serve the necessary properties', () => {

    const expectNotaryData = expect(notaryData)
      
    expectNotaryData.that.have.property('streetName')
    expectNotaryData.that.have.property('streetNumber')
    expectNotaryData.that.have.property('neighborhood')
    expectNotaryData.that.have.property('city')
    expectNotaryData.that.have.property('state')
    expectNotaryData.that.have.property('country')
    expectNotaryData.that.have.property('countryShortName')
    expectNotaryData.that.have.property('postalCode')
  })
})