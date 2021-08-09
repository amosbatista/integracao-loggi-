const tax = (transactionValue) => {

  const taxValue = 0
  const valuePostTax = transactionValue + taxValue

  return {
    taxValue,
    description: 'Taxa E-commerce',
    calculedValue: valuePostTax
  }
}

export default tax