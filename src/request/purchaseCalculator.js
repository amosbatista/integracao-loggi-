import ecommerceTax from '../bankTransaction/cieloTax'

const calculator = (servicesSum, deliveryTax) => {
  const transactionOperationTax = ecommerceTax(servicesSum + deliveryTax)
  const totalPurchase = servicesSum + deliveryTax + transactionOperationTax.calculedValue

  return {
    servicesSum,
    deliveryTax,
    transactionOperationTax,
    totalPurchase
  }
}

export default calculator