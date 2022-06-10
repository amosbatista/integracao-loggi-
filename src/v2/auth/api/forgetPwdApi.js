import { Router } from 'express'
import SearchByEmailMapper from '../db/mappers/searchByEmail';
import PwdRecoveryMapper from '../db/mappers/pwdRecovery'
import JWTTokenService from '../cripto/JWTTokenService';
import { v4 } from 'uuid';
import emailService from '../../email/service'
import emailHelper from '../../email/emailHelper'

export default ({ config, db }) => {

	let api = Router();

	api.post('/', async (req, res) => {
    const STATUS_SERVER_ERROR = 500

    const email = req.body.email

     if(!email) {
      const message = 'O email é obrigatório.'
      console.log(message)
      res.status(STATUS_UNAUTHORIZED).json(message)
      res.end()
      throw new Error(message)
    }

    const searchByEmailMapper = new SearchByEmailMapper();
    const thisEmailExists = await searchByEmailMapper.thisEmailExists(email).catch((err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    });

    if(!thisEmailExists) {
      const message = `Email ${email} não foi localizado.`;
      console.log(message)
      res.status(STATUS_SERVER_ERROR).json(message)
      res.end()
      throw new Error(message)
    }
    
    const objToSign = {
      email,
      uuid: v4()
    };
    const MINUTES_TO_EXPIRE = 10;
    const jWTTokenService = new JWTTokenService();
    const signed = jWTTokenService.signWithMinutes(objToSign, MINUTES_TO_EXPIRE);
    
    const pwdRecoveryMapper = new PwdRecoveryMapper();
    pwdRecoveryMapper.setTokenToUser(email, signed, objToSign.uuid);

    const emailContent = emailHelper(
      "Recuperação de senha",
      "cliente",
      email,[
        "Foi solicitado um e-mail para recuperação de senha. Segue o link abaixo:",
        `<a href="https://20cartorio.com.br/delivery/#/recovery/${objToSign.uuid}"><strong>https://20cartorio.com.br/delivery/#/recovery/${objToSign.uuid}</strong></a>`,
        "Caso não tenha solicitado a recuperação da senha, favor desconsiderar este email."
      ]
    );
    console.log(email, objToSign.uuid);

    await emailService(emailContent).catch((err) => {
      console.log(err.message, err.data)
      res.status(STATUS_SERVER_ERROR).json(err.message)
      res.end()
      throw new Error(err.message)
    });

    res.json("Email de recuperação enviado por e-mail")
    res.end()
  })

	return api;
}
