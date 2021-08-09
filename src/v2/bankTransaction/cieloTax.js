const tax = (transactionValue) => {

  const percentualTax = 0.02

  const taxValue = transactionValue * percentualTax
  const valuePostTax = transactionValue + taxValue

  return {
    taxValue,
    description: 'Taxa E-commerce',
    calculedValue: valuePostTax
  }
}

export default tax