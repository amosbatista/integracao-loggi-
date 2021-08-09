import tax from '../../../api/taxs/transactionEcommerce'
import chai from 'chai'

let expect = chai.expect

describe('Taxs test', () => {

  it('should be a function that applyes a transaction tax to some value', () => {
    expect(tax).to.be.a('function')

    const valuePreTax = 23.44
    const expected = {
      taxValue: 2.40,
      description: 'Taxa E-commerce',
      calculedValue: 25.84
    }

    expect(tax(valuePreTax)).be.deep.equal(expected)

    const secondValuePreTax = 0.85
    const secondExpected = {
      taxValue: 2.40,
      description: 'Taxa E-commerce',
      calculedValue: 3.25
    }
    
    expect(tax(secondValuePreTax)).be.deep.equal(secondExpected)

  })

})