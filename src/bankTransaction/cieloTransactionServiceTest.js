
const service = (paymentData) => {

  return new Promise ((resolve, reject) => {
    resolve({
      Payment: {
        ReturnMessage: "foo",
        ReturnCode: "00",
        Status: "test",
        PaymentId: "000",
        AuthorizationCode: "foobar",
        CreditCard: {
          CardNumber: "111111",
          Holder: "fooBar"
        }
      }
    })
   
  });
}

export default service