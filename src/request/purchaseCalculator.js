import ecommerceTax from '../bankTransaction/emptyTax'

const calculator = (servicesSum, deliveryTax) => {
  const transactionOperationTax = ecommerceTax(servicesSum + deliveryTax)
  const totalPurchase = transactionOperationTax.calculedValue

  return {
    servicesSum,
    deliveryTax,
    transactionOperationTax,
    totalPurchase
  }
}

export default calculator