import model from '../../../api/services/model'
import chai from 'chai'

let expect = chai.expect

describe('Service list test', () => {

  it('should be an array', () => {
    expect(model).to.be.an('array')
  })

  it('first service should serves service data', () => {
    const expectService0ToBeAnObject = expect(model[0]).to.be.an('object')
      
    expectService0ToBeAnObject.that.have.property('id').that.is.a('number')
    expectService0ToBeAnObject.that.have.property('text').that.is.a('string')
    expectService0ToBeAnObject.that.have.property('value').that.is.a('number')
    expectService0ToBeAnObject.that.have.property('formatted').that.is.a('string')
    expectService0ToBeAnObject.that.have.property('description').that.is.a('string')
    expectService0ToBeAnObject.that.have.property('quantifier').that.is.a('string')
      
  })

  it('second service should serves service data too', () => {
    const expectService0ToBeAnObject = expect(model[1]).to.be.an('object')
      
    expectService0ToBeAnObject.that.have.property('id').that.is.a('number')
    expectService0ToBeAnObject.that.have.property('text').that.is.a('string')
    expectService0ToBeAnObject.that.have.property('value').that.is.a('number')
    expectService0ToBeAnObject.that.have.property('formatted').that.is.a('string')
    expectService0ToBeAnObject.that.have.property('description').that.is.a('string')
    expectService0ToBeAnObject.that.have.property('quantifier').that.is.a('string')
  })
})