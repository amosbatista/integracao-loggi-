/*import transactionCaptureService from '../../bankTransaction/cieloCaptureService';
import transactionService from '../../bankTransaction/cieloTransactionService';
import transactionHashService from '../../bankTransaction/cieloHashTransactionService';
import cancelTransactionService from '../../bankTransaction/cieloCancelationService';*/
import transactionCaptureService from '../../bankTransactionMock/cieloCaptureService';
import transactionService from '../../bankTransactionMock/cieloTransactionService';
import transactionHashService from '../../bankTransactionMock/cieloHashTransactionService';
import cancelTransactionService from '../../bankTransactionMock/cieloCancelationService';


class PaymentHelperService {
  transactionReturnedData = null;
  
  async Pay(paymentData) {
    
    try{
      this.transactionReturnedData = paymentData.CardToken ? 
        await transactionHashService(paymentData) :
        await transactionService(paymentData)
      console.log(this.transactionReturnedData);
      return this.transactionReturnedData;
    }
    catch(errorData) {
      this.ProcessError(errorData);
      
      throw new Error("Erro ao processar compra com cartão.")
    }
  }
  
  async Capture () {
    try {
      await transactionCaptureService(this.transactionReturnedData.Payment.PaymentId);
    }
    catch(errorData) {
      this.ProcessError(errorData);
      
      throw new Error(`Erro ao processar captura de compra ${this.transactionReturnedData.Payment.PaymentId}`)
    }
  }
  
  async Cancel () {
    try {
      await cancelTransactionService(this.transactionReturnedData.Payment.PaymentId);
    }
    catch(errorData) {
      this.ProcessError(errorData);
      
      throw new Error(`Erro ao cancelar compra ${this.transactionReturnedData.Payment.PaymentId}`)
    }
  }
  
  ProcessError (errorData) {
    console.log(`${errorData.message}: ${errorData.data}` );
  }
}

export default PaymentHelperService;