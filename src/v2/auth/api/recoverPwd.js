import { Router } from 'express'
import PwdRecoveryMapper from '../db/mappers/pwdRecovery'
import JWTTokenService from '../cripto/JWTTokenService';
import emailService from '../../email/service'
import emailHelper from '../../email/emailHelper'
import hash from '../cripto/pwdHashHelper';

export default ({ config, db }) => {

	let api = Router();

	api.post('/', async (req, res) => {
    const STATUS_SERVER_ERROR = 500

    const recoverData = {
      key: req.body.recoverKey,
      pwd: req.body.pwd,
    }

     if(!recoverData.key) {
      const message = 'A chave de recuperação é obrigatória.'
      console.log(message)
      res.status(STATUS_SERVER_ERROR).json(message)
      res.end()
      throw new Error(message)
    }
    if(!recoverData.pwd) {
      const message = 'A nova senha é obrigatória.'
      console.log(message)
      res.status(STATUS_SERVER_ERROR).json(message)
      res.end()
      throw new Error(message)
    }

    const pwdRecoveryMapper = new PwdRecoveryMapper();
    const recoverToken = await pwdRecoveryMapper.loadByRecoverKey(recoverData.key).catch((err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    });

    const jWTTokenService = new JWTTokenService();
    const decoded = await jWTTokenService.verify(recoverToken).catch((err) => {
      console.log(err)
      res.status(STATUS_SERVER_ERROR).json("Erro ao recuperar senha.")
      res.end()
      throw new Error(err)
    });
    
    await pwdRecoveryMapper.setNewPwd(decoded.email, hash(recoverData.pwd));

    const emailContent = emailHelper(
      "20º cartório - Alteração de senha",
      "cliente",
      decoded.email,[
        "A senha para o seu e-mail foi alterada.",
        "Se você NÃO foi o autor desta mudança, procure o cartório com urgência."
      ]
    );

    await emailService(emailContent).catch((err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    });

    res.json("Senha alterada com sucesso.")
    res.end()
  })

	return api;
}
