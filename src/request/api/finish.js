import { Router } from 'express'

export default ({ config, db }) => {

	let api = Router();

	/**
   * Verificar se os dados vieram
   *  - Valor para ser pago
   *  - Motivo da diferença
   *  - Id do Registro
   *    Criar um registro em Compra
   *      Alterar status
   *      Criar log
   *      Criar link para pagamento
   *      Enviar por e-mail
   *      
   *     
   */
	api.post('/', (req, res) => {

	});

	return api;
}
