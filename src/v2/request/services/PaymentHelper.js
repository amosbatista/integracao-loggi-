import transactionCaptureService from '../../bankTransaction/cieloCaptureService';
import transactionService from '../../bankTransaction/cieloTransactionService';
import transactionHashService from '../../bankTransaction/cieloHashTransactionService';
import cancelTransactionService from '../../bankTransaction/cieloCancelationService';

/*import transactionCaptureService from '../../bankTransactionMock/cieloCaptureService';
import transactionService from '../../bankTransactionMock/cieloTransactionService';
import transactionHashService from '../../bankTransactionMock/cieloHashTransactionService';
import cancelTransactionService from '../../bankTransactionMock/cieloCancelationService';*/


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
      
      throw new Error(`Erro ao processar compra com cartão: ${errorData.message}`)
    }
  }
  


  async Capture (transactionId) {

    if(!transactionId) {
      try {
        await transactionCaptureService(this.transactionReturnedData.Payment.PaymentId);
      }
      catch(errorData) {
        this.ProcessError(errorData);
        
        throw new Error(`Erro ao processar captura de compra ${this.transactionReturnedData.Payment.PaymentId}: ${errorData.message}`)
      }

      return;
    }

    try {
      await transactionCaptureService(transactionId);
    }
    catch(errorData) {
      this.ProcessError(errorData);
      
      throw new Error(`Erro ao capturar compra pré-salva da transação ${transactionId}: ${errorData.message}`)
    }
  }


  async Cancel (transactionId) {
    if(!transactionId) {
      try {
        await cancelTransactionService(this.transactionReturnedData.Payment.PaymentId);
      }
      catch(errorData) {
        this.ProcessError(errorData);
        
        throw new Error(`Erro ao cancelar compra ${this.transactionReturnedData.Payment.PaymentId}: ${errorData.message}`)
      }

      return;
    }
    try {
      await cancelTransactionService(transactionId);
    }
    catch(errorData) {
      this.ProcessError(errorData);
      
      throw new Error(`Erro ao cancelar compra pré-salva ${transactionId}: ${errorData.message}`)
    }
  }
  
  ProcessError (errorData) {
    console.log(`${errorData.message}: ${JSON.stringify(errorData.data)}` );
  }
}

export default PaymentHelperService;